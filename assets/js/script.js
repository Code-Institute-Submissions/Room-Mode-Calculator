$(document).ready(function() {


    //Initialise popovers
    $(function() {
        $("#submitBtn").popover();
    });



    //---------------------Define Variables --------------//


    const speedOfSound = 344; // speed of sound in air in meters per second (21 degrees celsius)
    var dimensions = []; //dimensions array - replace with user input
    var frequencies = [];


    //return the dimensions of drawing area for currently selected 
    var drawAreaHeight = $("#drawingArea").height();
    var drawAreaWidth = $("#drawingArea").width();



    function drawRoom(xDim, yDim, zDim) {
        //If the z-axis is equal to or larger than other x-axes the room will be
        //too large for the drawing area. This derives a scale to reduce the overall size
        //derive the  to maximise diagram size based on room x-axis and y-axis
        var scaleQ = xDim + yDim;
        if (Math.max(...dimensions) === zDim) {
            var baseProportion = Math.round(drawAreaHeight / scaleQ) * 0.8;
        }
        else {
            var baseProportion = Math.round(drawAreaWidth / scaleQ) * 0.8;
        }

        var posQ = drawAreaWidth / (xDim + yDim) * xDim; //x position of origin is based on length of x-axis (red)


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






        // Animate --------------------------- //
        xAxisDraw();
        yAxisDraw();
        zAxisDraw();

        //Animate drawing of x-axis
        function xAxisDraw() {
            var posX = originX;
            var posY = originY;
            var id = setInterval(frame, 0.1);

            function frame() {
                if (posX == originX - xLength) {
                    clearInterval(id);
                }
                else {
                    posX--;
                    posY--;
                    $("#xAxis").attr("x2", posX);
                    //$("#xAxis").attr("y2", posY);
                }
            }
        }


        //Animate drawing of y-axis
        function yAxisDraw() {
            var pos = originX;
            var id = setInterval(frame, 0.1);

            function frame() {
                if (pos == originX + yLength) {
                    clearInterval(id);
                }
                else {
                    pos++;
                    $("#yAxis").attr("x2", pos);
                }
            }
        }


        //Animate drawing of z-axis
        function zAxisDraw() {
            var pos = originY;
            var id = setInterval(frame, 0.1);

            function frame() {
                if (pos == originY + zLength) {
                    clearInterval(id);
                }
                else {
                    pos++;
                    $("#zAxis").attr("y2", pos);
                }
            }
        }


    }









    //--------------------------Input Functions-----------//


    //Error to display if invalid dimensions are entered

    function invalidDimensionsError() {
        $("#submitBtn").toggleClass("btn-success btn-danger").text("X");
        $("#submitBtn").popover("show");
    }


    //calculate frequency based on dimension
    function freqCalc(dimen) {
        return Math.round(speedOfSound / dimen);
    }



    //function to display dimension outputs
    function dimensionOutputs(x, y, z) {

        //Dimension outputs
        //clear dimensions array and push user inputs to dimensions array 
        dimensions.length = 0;
        dimensions.push(x, y, z);

        $("#titleLen").text(`Length: ${x}m`);
        $("#titleWid").text(`Width: ${y}m`);
        $("#titleHei").text(`Height: ${z}m`);



        //Frequencies outputs
        frequencies = dimensions.map(freqCalc);

        $("#freqLen").text(`Frequency: ${frequencies[0]}Hz`);
        $("#freqWid").text(`Frequency: ${frequencies[1]}Hz`);
        $("#freqHei").text(`Frequency: ${frequencies[2]}Hz`);

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

            //Remove "d-none" class from svg elements"
            $(".line").removeClass("d-none"); //maybe change this to the SVG element

            dimensionOutputs(xIn, yIn, zIn); // call function to fill the output display on left
            drawRoom(xIn, yIn, zIn); //call function to draw the room

            $("#dimensionForm").trigger("reset");

        }
    }











    //---------------------------Audio Code  ---------------------//

    //Establish the audio context
    var audioCtx = new(window.AudioContext);
    var sound = audioCtx.createOscillator();
    var volume = audioCtx.createGain();
    sound.start();
    var playCheck = false; //check if audio is playing - initialise as false on page load

    $(".play-button").click(playBtnActions);




    function playBtnActions() {
        var freqIndex = parseInt($(this).attr("id").slice(7));
        var thisPlayBtn = $(this).attr("id");
        playBtnDisplay(thisPlayBtn);


        createNote(frequencies[freqIndex]);

    }

    //Change the display of the play buttons     
    function playBtnDisplay(actBtn) {
        if ($(`#${actBtn}`).text() === "Play") {
            $(".play-button").removeClass("btn-danger").addClass("btn-success");
            $(".play-button").text("Play");
            $(`#${actBtn}`).addClass("btn-danger").removeClass("btn-success").text("Stop");
            startPlayback();
        }
        else {
            $(`#${actBtn}`).addClass("btn-success").removeClass("btn-danger").text("Play");
            stopPlayback();
        }
    }


    function createNote(frequency) {

        sound.frequency.value = frequency;
        sound.type = "sine";
        sound.connect(volume);
        volume.gain.value = 0.2;
    }



    function startPlayback() {
        volume.connect(audioCtx.destination);
    }


    function stopPlayback() {
        volume.disconnect(audioCtx.destination);
    }




    //end of code
});
