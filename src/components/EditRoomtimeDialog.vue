<template>
  <v-layout row justify-center>
    <v-dialog
      max-width="600px"
      v-model="dialogState.rt"
      scrollable
      persistent
      lazy
    >
      <v-card>
        <v-card-title>
          <span class="headline" v-if="rt.id">
            Edit {{ formData.room | roomNameFromSlug }}
          </span>
          <span class="headline" v-else>Add {{ formData.room | roomNameFromSlug }}</span>
        </v-card-title>
        <v-card-text style="text-align: left;">
          <v-progress-linear v-if="isSubmitting" :indeterminate="true"></v-progress-linear>

          <v-alert v-show="error" type="error" :valid="true" v-html="error"></v-alert>

          <v-container grid-list-md>
            <form enctype="multipart/form-data" method="post" novalidate>
              <v-layout wrap>
                <v-flex lg4>
                  <frames-input
                    label="Room time"
                    v-model="formData.frames"
                    :disabled="isSubmitting"
                    autofocus
                    required
                  />
                </v-flex>
                <v-flex lg4>
                  <v-text-field
                    label="Lag frames"
                    v-model="formData.lag"
                    :disabled="isSubmitting"
                    type="number"
                    placeholder="0"
                    required
                  />
                </v-flex>
                <v-flex lg4>
                  <v-text-field
                    label="# of menues"
                    v-model="formData.menues"
                    :disabled="isSubmitting"
                    type="number"
                    placeholder="0"
                    required
                  />
                </v-flex>
                <v-flex lg6>
                  <v-text-field
                    label="Idle frames"
                    v-model="formData.idle"
                    type="number"
                    placeholder="0"
                    :disabled="isSubmitting"
                  />
                </v-flex>
                <v-flex lg6>
                  <v-select
                    label="LTTPHack version"
                    v-model="formData.lttphackVersion"
                    :items="[9]"
                    ></v-select>
                </v-flex>

                <v-flex xs12>
                  <label>
                    Media
                  </label>

                  <v-expansion-panel popout>
                    <v-expansion-panel-content :value="uploadMedia" ref="uploadPanel">
                      <div slot="header">
                        <v-checkbox
                          :disabled="true"
                          v-model="uploadMedia"
                          style="display: inline-block; width: auto; vertical-align: middle;"
                          hide-details
                        />
                        Video / image
                      </div>
                      <v-card>
                        <v-card-text>
                          <input
                            type="file"
                            id="file"
                            class="file-input"
                            accept="image/*,video/*"
                            @change="fileChanged"
                            :disabled="isSubmitting"
                          />
                          <label class="file-label" for="file">
                            <v-icon color="white">backup</v-icon>
                            <span v-if="currentFilename">
                              {{ currentFilename }}
                            </span>
                            <span v-else>
                              Choose a file...
                            </span>
                          </label>
                        </v-card-text>
                      </v-card>
                    </v-expansion-panel-content>

                    <v-expansion-panel-content :value="twitchMedia" ref="twitchPanel">
                      <div slot="header">
                        <v-checkbox
                          :disabled="true"
                          v-model="this.twitchMedia"
                          style="display: inline-block; width: auto; vertical-align: middle;"
                          hide-details
                        />
                        Twitch embed
                      </div>
                      <v-card>
                        <v-card-text>
                          <v-text-field
                            label="Twitch highlight or clips URL"
                            v-model="formData.twitchUrl"
                            :disabled="isSubmitting"
                            required
                          />
                        </v-card-text>
                      </v-card>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-flex>

                <v-flex xs12>
                  <label>Description</label>
                  <vue-editor
                    id="description-editor"
                    v-model="formData.description"
                    :disabled="isSubmitting"
                  />
                </v-flex>
              </v-layout>
            </form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn
            dark
            color="red darken-3"
            v-if="rt.id"
            @click.native="remove"
            :disabled="isSubmitting"
          >Delete</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="grey darken-1"
            @click.native="closeDialog"
            :disabled="isSubmitting"
            flat
          >Close</v-btn>
          <v-btn
            color="green darken-3"
            @click.native="save"
            :disabled="isSubmitting"
            dark
          >Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import RoomtimeService from '@/services/RoomtimeService'
import FramesInput from '@/components/FramesInput'
import { restErrorToString } from '@/utils'

export default {
  props: ['dialogState'],
  data () {
    return {
      error: null,
      initialMedia: {},
      isSubmitting: false,
      twitchMedia: false,
      uploadMedia: false
    }
  },
  mounted () {
    this.initialMedia = this.formData.media
    this.uploadMedia = !!this.formData.media.filename
    this.twitchMedia = !!this.formData.twitchUrl

    // TODO: Dangit. This is very hackish, I'm not sure how to fix it.
    this.$refs.uploadPanel.$el.onclick = (e) => {
      let header = false
      e.composedPath().forEach(el => {
        if (el.classList && el.classList.contains('v-expansion-panel__header')) {
          header = true
        }
      })
      if (header) {
        this.uploadMedia = !this.uploadMedia
        if (this.uploadMedia) {
          this.twitchMedia = false
        }
        return false
      }
    }

    this.$refs.twitchPanel.$el.onclick = (e) => {
      let header = false
      e.composedPath().forEach(el => {
        if (el.classList && el.classList.contains('expansion-panel__header')) {
          header = true
        }
      })
      if (header) {
        this.twitchMedia = !this.twitchMedia
        if (this.twitchMedia) {
          this.uploadMedia = false
        }
        return false
      }
    }
  },
  components: {
    FramesInput
  },
  methods: {
    closeDialog () {
      this.error = null
      this.dialogState.rt = false
    },
    async save () {
      const formData = new FormData()
      formData.set('frames', this.formData.frames)
      formData.set('lag', this.formData.lag)
      if (this.formData.idle !== null) {
        formData.set('idle', this.formData.idle)
      }
      formData.set('menues', this.formData.menues)
      formData.set('description', this.formData.description)
      formData.set('lttphack_version', this.formData.lttphackVersion)

      if (this.twitchMedia) {
        formData.set('twitch_url', this.formData.twitchUrl)
      } else {
        formData.set('twitch_url', '')
      }

      if (this.uploadMedia) {
        if (this.formData.media !== this.initialMedia) {
          formData.set('media', this.formData.media)
        }
      } else {
        formData.set('remove_media', true)
      }

      this.isSubmitting = true
      try {
        let response = null
        if (this.rt.id) {
          response = await RoomtimeService.update(this.$store.state.user.username, this.rt.id, formData)
        } else {
          formData.set('room', this.formData.room)
          response = await RoomtimeService.create(this.$store.state.user.username, formData)
        }
        this.$emit('save', this.rt, response.data)
        this.closeDialog()
      } catch (error) {
        this.error = restErrorToString(error)
      } finally {
        this.isSubmitting = false
      }
    },
    async remove () {
      this.isSubmitting = true
      try {
        const response = await RoomtimeService.delete(this.$store.state.user.username, this.rt.id)
        this.$emit('remove', this.rt, response.data)
        this.closeDialog()
      } catch (error) {
        this.error = restErrorToString(error)
      } finally {
        this.isSubmitting = false
      }
    },
    fileChanged (e) {
      this.formData.media = e.target.files ? e.target.files[0] : null
    }
  },
  computed: {
    rt () {
      return this.dialogState.rt ? this.dialogState.rt : {}
    },
    formData () {
      return this.dialogState.formData ? this.dialogState.formData : {}
    },
    currentFilename () {
      if (this.formData.media.filename) {
        return this.formData.media.filename
      }
      if (this.formData.media.name) {
        return this.formData.media.name
      }
      return ''
    }
  }
}
</script>

<style>
.alert {
  display: block;
}

#description-editor .ql-editor {
  min-height: 90px;
}

.dialog {
  overflow-y: visible;
}

.file-input {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.file-label {
  font-size: 1.25rem;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  display: inline-block;
  overflow: hidden;
  padding: 0.625rem 1.25rem;

  background-color: #5e4294;
  color: #f1e5e6;
  max-width: 100%
}

.file-input:focus + .file-label,
.file-label:hover {
  background-color: #4d3183;
}

.file-input:focus + .file-label {
  outline: 1px dotted #000;
  outline: -webkit-focus-ring-color auto 5px;
}

.file-label * {
  pointer-event: none;
}

</style>
