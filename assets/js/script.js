$(document).ready(function() {


    //Initialise popovers
    $(function() {
        $("#submitBtn").popover();
    });



    //---------------------Define Variables --------------//

    
    var dimensions = []; //Define test dimensions array - replace with user input
    const speedOfSound = 344; // speed of sound in air in meters per second


    //return the dimensions of drawing area for currently selected 
    var drawAreaHeight = $("#drawingArea").height();
    var drawAreaWidth = $("#drawingArea").width();



    function drawRoom(xDim, yDim, zDim) {
        //If the z-axis is equal to or larger than other x-axes the room will be
        //too large for the drawing area. This derives a scale to reduce the overall size



        //derive the  to maximise diagram size based on room x-axis and y-axis
        var scaleQ = xDim + yDim;
        var baseProportion = Math.round(drawAreaWidth / scaleQ);
        var posQ = drawAreaWidth / scaleQ * xDim; //x position of origin is based on length of x-axis (red)


        //lengths Are dimension * baseProportion * value in [dimensions] array
        var xLength = Math.round(baseProportion * xDim);
        var yLength = Math.round(baseProportion * yDim);
        var zLength = Math.round(baseProportion * zDim);



        //set origin point - the point where the three main axes meet
        // Test with one third from left [x,y] and 90% from top
        var originX = Math.round(posQ);
        var originY = Math.round(drawAreaHeight) - zLength;
        var angleUp = Math.round(drawAreaHeight * 0.1); //angle x and y axes up by 10% draw area height


        //---------------------------------------------------------------------//



        //Draw main, coloured axes
        $("#xAxis").attr({
            x1: originX,
            y1: originY,
            x2: originX - xLength,
            y2: originY - angleUp

        });
        $("#yAxis").attr({
            x1: originX,
            y1: originY,
            x2: originX + yLength,
            y2: originY - angleUp

        });
        $("#zAxis").attr({
            x1: originX,
            y1: originY,
            x2: originX,
            y2: originY + zLength

        });


        //Draw background, grey axes

        $("#backPath").attr("d", `M ${originX - xLength},${originY - angleUp} 
                           v${zLength}
                           l${xLength}, ${angleUp}
                           l${yLength}, ${-angleUp}
                           v${-zLength}
                           l${-xLength}, ${-angleUp}
                           l${-yLength}, ${angleUp}
                  
        `);
    }



    //--------------------------Input Functions-----------//


    //Error to display if invalid dimensions are entered

    function invalidDimensionsError() {
        $("#submitBtn").toggleClass("btn-success btn-danger").text("X");
        $("#submitBtn").popover("show");
    }


    //calculate frequency based on dimension
    function freqCalc(dim)  {
        return Math.round(speedOfSound/dim);
    }
        

    
    //function to display dimension outputs
    function dimensionOutputs(x, y, z) {
        $("#titleLen").text(`Length: ${x}m`);
        $("#titleWid").text(`Width: ${y}m`);
        $("#titleHei").text(`Height: ${z}m`);
        
        $("#freqLen").text(`Frequency: ${freqCalc(x)}Hz`);
        $("#freqWid").text(`Frequency: ${freqCalc(y)}Hz`);
        $("#freqHei").text(`Frequency: ${freqCalc(z)}Hz`);
        
    }


    //On submit the inputs will be assigned to the dimension boxes and [dimensions] array

    $("#submitBtn").on("click", addDimensions);

    function addDimensions() {

        //change input values to numbers
        var xIn = parseFloat($("#xInput").val());
        var yIn = parseFloat($("#yInput").val());
        var zIn = parseFloat($("#zInput").val());

        if (isNaN(xIn) === true || isNaN(yIn) === true || isNaN(zIn) === true) {

            invalidDimensionsError();
        }

        else {
            //clear dimensions array
            dimensions.length = 0;
            dimensions.push(xIn, yIn, zIn);

            //Remove "d-none" class from svg elements"
            $(".line").removeClass("d-none"); //maybe change this to the SVG element

            dimensionOutputs(xIn, yIn, zIn); // calll function to fill the output display on left
            drawRoom(xIn, yIn, zIn);  //call function to draw the room

            $("#dimensionForm").trigger("reset");
        }
    }

















    //---------------------------Audio Test Code  ---------------------//

    //Establish the audio context
    var audioCtx = new(window.AudioContext);
    var volume = audioCtx.createGain();
    var playCheck = false; //check if audio is playing - initialise as false on page load

    $("#play").click(playBtnActions);


    function playBtnActions() {
        createChord();
        connectToOutput();
    }

    /* Not used currently
    
    function toggleButton() {
        $("#play").toggleClass("btn-danger btn-success");

        if (playCheck === false) {
            $("#play").text("Stop");
        }
        else {
            $("#play").text("Play");
        }
    }
    
    */



    function connectToOutput() {

        if (playCheck === false) {
            volume.connect(audioCtx.destination);
            playCheck = true;
            console.log(playCheck);
        }
        else {
            volume.disconnect(audioCtx.destination);
            playCheck = false;
            console.log(playCheck);
        }
    }





    function createChord() {
        // Thee sine waves at different frequencies 

        var sinea = audioCtx.createOscillator();
        sinea.frequency.value = 440;
        sinea.type = "sine";
        sinea.start();
        sinea.connect(volume);

        var sineb = audioCtx.createOscillator();
        sineb.frequency.value = 523.25;
        sineb.type = "sine";
        sineb.start();
        sineb.connect(volume);

        var sinec = audioCtx.createOscillator();
        sinec.frequency.value = 698.46;
        sinec.type = "sine";
        sinec.start();
        sinec.connect(volume);

        volume.gain.value = 0.2;
    }



    //end of code
});
