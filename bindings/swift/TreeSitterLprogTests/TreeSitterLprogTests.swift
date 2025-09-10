import XCTest
import SwiftTreeSitter
import TreeSitterLprog

final class TreeSitterLprogTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_lprog())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Lambda Prog grammar")
    }
}
