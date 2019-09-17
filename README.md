# Milestone 2 - Interactive Frontend Development
# Objective

This application is to calculate room modes based on user input of room dimensions (length, width, height). Room modes are the natural frequencies at which a room with parallel walls resonates (i.e. most domestic rooms). This can cause uneven response at these frequencies at different listening positions. These frequencies are cancelled/boosted based on the nodes and antinodes of the natural standing wave which causes issues when recording or mixing audio.

https://en.wikipedia.org/wiki/Room_modes


On input of dimensions the application will:

Render (with animation) a visual representation of the room.
Output the room mode fundamental frequency per room dimension.
N.B time permitting add first and second harmonic per dimension also.
Output the corresponding (closest) musical note for room modes per dimension
Provide audio playback facility of frequencies identified above
(and if possible first and second harmonic).
Allow selection of each of the room dimensions with animated visual representation (sine wave) of room modes.
Modal page to include explanation of room modes.


# User Goals:
The application is primarily aimed for use by musicians recording or mixing music in a domestic environment where the issue of room modes is common. The application wil laid users by:

providing insight into problematic frequencies/musical notes. Audibility of these frequencies will vary dependent on the listener’s position in the room.
To identify problematic listening positions to mitigate the room mode effects and aid in positioning monitor speakers.
To identify problematic positions for microphone positioning to mitigate the room mode effects.



# Technologies used
* HTML
* CSS
* Javascript
* Bootstrap
* JQuery