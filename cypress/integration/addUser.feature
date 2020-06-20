Feature: Create new user

  Background: 
    Given I login to tinypulse system successfully

  Scenario: Add some users successfully and verify information
    Given I go to User Settings page
    When I create new users
    Then new users info should display on congratulations page

  Scenario: Add existing user and verify error message
    Given I go to User Settings page
    When I create existing user
    Then error message should be display on congratulations page
