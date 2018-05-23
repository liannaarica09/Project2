var Nightmare = require("nightmare");
var expect = require("chai").expect;


describe("Trigger-Tracker", function () {
    // The default tests in mocha is 2 seconds.
    // Extending it to 30 seconds to have time to load the pages

    this.timeout(30000);
    it("should make API calls", function (done) {
        // ID for the login button.
        Nightmare({ show: true })
            .goto("http:localhost:3000/index")
            // type Seattle in search field
            .type("#userInput", "Seattle")
            // click
            .click("#city-search")
            // Evaluate the 
            .evaluate(function () {
                return document.querySelector("#city-name");
            })
            // Asset the title is as expected
            .then(function (title) {
                expect(document.querySelector("#city-name").should.have.text("Seattle"));
                done();
            });

    });
})
