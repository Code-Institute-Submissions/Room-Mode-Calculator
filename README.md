# Milestone 2 - Interactive Frontend Development
## Objective

This application is to calculate room modes based on user input of room dimensions (length, width, height) and provide audio, graphical and numerical feedback.

Room modes are the natural frequencies at which a room with parallel surfaces resonates (i.e. most domestic rooms). 
This can cause uneven response at these frequencies at different listening positions. 
When listening or recording at a node positions (zero point of wave) the relevant room mode frequency is significantly weaker.
Correspondingly - at the the node points (point of greatest amplitude of the wave) the frequency is significantly boosted. 
To a diminishing degree the same effect is also true for harmonics (mulitples) for each room mode.

Why does this matter?

The upshot of this is that in typical domestic rooms, with parallel surfaces, there will be an inherent unevenness in the frequency reponse of 
these room mode frequencies (and their harmonics) at the room mode frequencies.
Given the ever increasing popularity of home recording this can be a particular issue that can be overlooked by musicians/sound engineers working at home.
Room modes can cause significant problems when trying to balance and equalise music recorded in domestic rooms and this can be mitigated, to some degree, by adjusting listening and/or microphone position away from points where the effects of room modes are prevalent. 
In other words - away from the node points where that frequency is inherently quieter or cancelled. Also, away from the antinode points where that frequency is inherently louder.

Further information can be found here:
https://en.wikipedia.org/wiki/Room_modes

## UX Design

On input of room dimensions to provide insight into:
* Problematic distances on each room axis (nodes and antnodes).
  Displayed when individual room dimensions are selected.
* The frequency of the room mode for each room dimension.
* The corresponding musical note for each of the room nodes.

This can help when working with music to determine positioning. In addition to this, for a sound engineer that finds themselves consistently applying large scale EQ cuts or boosts at similar frequencies this tool can help identify if room modes may be a contributing factor.
Conversely for musicians/sound engineers that find themselves consistently fins themselves making EQ boosts/cuts at similar frequencies - this tool can aid in identifying if room modes are a contributing factor.

## Features
### Existing Features
On submitting room dimensions the application will:
* Display a graphical representation of the room.
* Display the specified dimensions within the dimension buttons.
* Display the room mode frequency for each dimension.
* Display the closest musical that corresponds to that frequency (the frequencies returned will very likely not correspond directly to a musical note and will lie between two notes. The closest note to the frequency selected)

On pressing a dimension button (Length, Width, Height)
* This will give a view for the relevant room dimension displaying room mode nodes and antinodes.
* The distance from the wall for the node for the fundamental frequency is displayed.

On pressing the question mark at the top of the screen a basic explanation of room modes is given

### Features to be implemented
* Add button to revert to fulll room view from axis view
* Functionality to select harmonics for room nodes in addition to fundamental frequency with corresponding wave display and node/antinode readout in axis focus view   
* Add dimension labels to axes when the full room is viewed 
* Improved visual aesthetics

## Technologies used
* HTML https://www.w3.org/html/
* CSS https://www.w3.org/Style/CSS/Overview.en.html
* Javascript https://developer.oracle.com/javascript/
* Bootstrap https://getbootstrap.com/
* Bootswatch https://bootswatch.com/
* JQuery https://jquery.com/
* Web Audio API https://www.w3.org/TR/webaudio/

## Testing
Testing Results, and wireframe here:
https://drive.google.com/drive/folders/1wlheOZaZroJo9TtYVRehKNxVWaDsw-0k?usp=sharing

## Bugs/Issues
* In desktop view - when the y-axis is the smallest dimension the room doesnt fully render within the drawing area.
This doesnt occur on mobile view.
* Clicking on a dimensions button (e.g.) without valid dimensions returns an error but stills draw a view of the wave. This needs to be removed.

## Deployment
* The development repository (https://github.com/Echoic88/milestone2-interactive-frontend) 
  cloned to published repository (https://github.com/Echoic88/room-mode-calculator.git)
* Website deployed from Master Branch of cloned repository (https://github.com/Echoic88/room-mode-calculator.git)
* Deployed url: 
    https://echoic88.github.io/room-mode-calculator2/
    

# References
* https://codeinstitute.net/5-day-coding-challenge/?ads_cmpid=1378516521&ads_adid=56427889338&ads_matchtype=e&ads_network=g&ads_creative=304733531881&utm_term=code%20institute&ads_targetid=kwd-319867646331&utm_source=google&utm_medium=cpc&gclid=EAIaIQobChMIqZKQur7l5AIVS9reCh2nRgSSEAAYASAAEgIQTPD_BwE
* https://www.w3schools.com/
* https://stackoverflow.com/
* http://teropa.info/blog/2016/08/04/sine-waves.html
* https://www.html5rocks.com/en/tutorials/webaudio/intro/
* https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API 
* https://developer.mozilla.org/en-US/docs/Web/Accessibility

# Credits
* Room Mode image:
 assets/images/330px-Onde_stationnaire_vitesse_tuyau_ouvert_trois_modes.svg.png
 take from 
 https://en.wikipedia.org/wiki/Room_modes#/media/File:Onde_stationnaire_vitesse_tuyau_ouvert_trois_modes.svg