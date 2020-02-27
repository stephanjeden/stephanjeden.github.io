

    // This is a statement: 
    /* Here, I'm writing the same "this is a statement" message using a multi line comment. */

    // First, declare a variable. Some sort of data holder. This one will simply hold a string of text.
    var myVariable;

    // Here, I insert a string of text into my data holder, aka variable.
    myVariable = "The most amazing variable ever. Really. Ever.";

    // Here, I repeat the same process again. I declare a variable and give it a value, that is, the data that I want it to hold, all at the same time, in this case. 
    // This makes it easier to and more efficient to create a data holder/variable.
    var beauty = "sunsets over the rockies, and ";
    
    // Here, I again create a variable, but this time I don't use the simplified functionality available in JS of declaring the variable and
    // inserting it's value/data at the same time. Instead, for the sake of practice, I declared both separately.
    var moreBeauty;
    moreBeauty = "sunsets in San Diego.";
    
    // Again, I create a variable and insert data. Only this time, I don't merely insert a string. Instead, I insert a string and also insert 
    // a couple other variables...what this does is pull the data in these other variables and puts it in this variable's data.
    var describeBeauty;
    describeBeauty = "Beauty is " + beauty + moreBeauty;
    

    // Here, I'm not creating a data holder, but instead creating a doer. A function. Something that goes and does something. In this example,
    // we create a function that, very simply, will create a message in the console when something calls it/activates it. What does put in the 
    // console? Well, it starts with a string, and then follows that string with a dynamic (changing) piece of data. The "it's all up to me" 
    // in the arguments section of the function (the part in parentheses) can be used by other functions to send data to myBeautifulFunction. 
    // What will myBeautifulFunction do with that data that can be sent with stamp of "itsAllUpToMe"? Well, any data that myBeautifulFunction
    // gets packaged in "itsAllUpToMe" will be inserted into the console message right after the string.
    function myBeautifulFunction(itsAllUpToMe) {
        
        console.log("What did you just do?"  + itsAllUpToMe);

    }
    
    /* Here, I create a function that will call myBeautifulFunction and send it data into its arguments section. We begin by defining what will 
    initiate the call of myBeautifulFunction: we select the body of the page and then select the first (0) body there is. Then we tell the system
    that we want to pay attention to when any key is pressed, and when it is, we want to start a generic anonymous function, which will in turn
    call myBeautifulFunction, and then in parethesis we tell myBeautifulFunction what we want to have sent to the arguments section, which, in this 
    case, is a string. */
    document.getElementsByTagName("body")[0].onkeypress = function() {
        myBeautifulFunction("This emergency notification is to inform you that you just pressed a key.")
    }

    
    // Last but not least, we here make a function to creat an alert when the "h1" is clicked, and we want the alert to contain the contents of "describeBeauty", above.
    document.getElementsByTagName("h1")[0].onclick = function() {
        alert(describeBeauty);
    }


    // Here, we're learning form validation! We create two variables, one with an example email address (could be anything, like a phone number), and then we'll create a variable that will run the indexOf function. Then we run the console.log function so that we can see, in our browser's console, whether our code worked.

    var someEmailAddress = "stephanjeden@gmail.com";
    var checkSomeEmailAddress = "The index is " + someEmailAddress.indexOf("@");

    console.log(checkSomeEmailAddress);


    // Here, we'll use the isNaN built in method to confirm (or deny) that a given input is a number.

    var someDataThatIsEitherANumberOrAString = "This is a string, so the isNaN method will return with the message 'true'";

    var useIsNaNToCheckOurVariableAbove = isNaN(someDataThatIsEitherANumberOrAString);

    console.log(useIsNaNToCheckOurVariableAbove);


    // Yay! First "if" statement!!!

    if(5<4)
    {
        console.log("Yes, 1 is less than 4, dummy.");
    }
    else {
        console.log("No, dufas, 4 is not 5.");
    }



