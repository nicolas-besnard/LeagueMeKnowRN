//
//  LeagueMeKnowUITests.swift
//  LeagueMeKnowUITests
//
//  Created by Nicolas Besnard on 01/04/2020.
//

import XCTest

class LeagueMeKnowUITests: XCTestCase {

    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.

        // In UI tests it is usually best to stop immediately when a failure occurs.
        continueAfterFailure = false

        // In UI tests it’s important to set the initial state - such as interface orientation - required for your tests before they run. The setUp method is a good place to do this.
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    func testExample() throws {
        // UI tests must launch the application that they test.
        let app = XCUIApplication()
        setupSnapshot(app)
        app.launch()

        sleep(5)
      
        let teamsButtonTab = app.buttons["TeamsButton"]
        XCTAssertTrue(teamsButtonTab.exists)

        snapshot("01Matches")

        teamsButtonTab.tap()
        sleep(5)
        snapshot("02Teams")
    }
}
