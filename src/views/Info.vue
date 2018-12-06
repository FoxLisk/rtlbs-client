<template>
  <div>
    <v-container grid-list-sm>
      <v-layout>
        <v-flex offset-lg3 lg6 offset-sm1 sm10 offset-md2 md8 offset-xs0 xs12>
          <v-card height="100%">
            <v-card-title>
              <h2>ALttP Room Leaderboards</h2>
            </v-card-title>
            <v-divider />
            <v-card-text>
              <section>
                <h2>How scoring works</h2>
                <p>When you submit a roomtime, you will be ranked against other people who have submitted roomtimes for that room. This rank is then converted into a score. In order from rank 1 to 10 you will get the following scores: 50, 40, 35, 30, 25, 20, 16, 12, 8, 4.</p>
                <p>Your global rank (your position on the leaderboard) is dependent on your total score for all rooms.</p>
                <p>If multiple people does a room equally fast, they will get the same rank and score.</p>
              </section>

              <section>
                <h2>Submitting roomtimes</h2>
                <p>
                  We require you to fill in <code>frames</code>, <code>lag</code> and <code>menues</code>. This is mostly to make the data as useful as possible for other players.
                </p>
                <p>
                  <code>frames</code> is currently the only factor when ranking roomtimes. Remember to input it like this: <code>1'23</code>, meaning 1 second and 23 frames.
                </p>
                <p>
                  <code>lag</code> makes it easier to compare your times with other roomtimes.
                  It can be frustrating trying to beat a time, only to realize later that you had more lag due to how you executed the previous room, for example.
                </p>
                <p>
                  <code>menues</code> also makes it easier to compare roomtimes, since different players put their menues in different screens.
                </p>
                <p>
                  <code>idle</code> (not required) tells you how fast you mashed through text or how optimal your menues were. The higher the number, the less optimal you were.
                </p>
                <p>
                  The counters can be toggled on in the LTTPHack menu under Features.
                </p>
                <p>
                  You must use LTTPHack v9 or later. v8 has different timings in quite a few screens, so it would not be comparable.
                </p>
              </section>

              <section>
                <h2>Tips for getting better roomtimes</h2>
                <p>
                  - If you find that you get more lag than other players and you don't understand why - try to reset your SNES/emulator, start a new file, and use a preset to get back to where you were. Some screens will get less lag if you do this.
                </p>
                <p>
                  - Enable the idle counter to see how fast you do your menues and how fast you mash text. This makes it a lot easier to know what your limits on certain screens are.
                </p>
                <p>
                  - Disable any LTTPHack features you don't need. Things like Coordinate or Enemy HP can add extra lag. Though most people will use the Input Display even though it's not needed.
                </p>
                <p>
                  - Watch GodTAS 5, GodSplice etc. and see what they do.
                </p>
              </section>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>
#scores {
  list-style: none;
  margin-left: 2px;
  margin-bottom: 12px;
}

section {
  margin-bottom: 20px;
}
</style>
