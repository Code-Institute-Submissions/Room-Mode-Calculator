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
In other words - away from the node points where that frequency is inherently quieter or cancelled. Also away from the antinode points where that frequency is inherently louder.


The aims of this applicaiton are:

On input of room dimensions to provide insight into:
* Problematic distances on each room axis (nodes and antnodes).
* The frequency of the room mode for each room dimension .
* The corresponding musical note for each of the room nodes.

Further information can be found here:
https://en.wikipedia.org/wiki/Room_modes



## Technologies used
* HTML https://www.w3.org/html/
* CSS https://www.w3.org/Style/CSS/Overview.en.html
* Javascript https://developer.oracle.com/javascript/
* Bootstrap https://getbootstrap.com/
* JQuery https://jquery.com/
* Web Audio API https://www.w3.org/TR/webaudio/



## Future Development
* Functionality to select harmonics for room nodes in addition to fundamental frequency  
* Improved visual aesthetics





# References
* https://codeinstitute.net/5-day-coding-challenge/?ads_cmpid=1378516521&ads_adid=56427889338&ads_matchtype=e&ads_network=g&ads_creative=304733531881&utm_term=code%20institute&ads_targetid=kwd-319867646331&utm_source=google&utm_medium=cpc&gclid=EAIaIQobChMIqZKQur7l5AIVS9reCh2nRgSSEAAYASAAEgIQTPD_BwE
* https://www.w3schools.com/
* https://stackoverflow.com/
* http://teropa.info/blog/2016/08/04/sine-waves.html
* https://www.html5rocks.com/en/tutorials/webaudio/intro/
* https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API 
* 


# Credits
* Room Mode image:
 assets/images/330px-Onde_stationnaire_vitesse_tuyau_ouvert_trois_modes.svg.png
 take from 
 https://en.wikipedia.org/wiki/Room_modes#/media/File:Onde_stationnaire_vitesse_tuyau_ouvert_trois_modes.svg