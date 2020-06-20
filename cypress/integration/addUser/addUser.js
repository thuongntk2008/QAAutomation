import { Given, When, Then , And} from 'cypress-cucumber-preprocessor/steps';

let randomString = ""
let user1_name = ""
let user2_name = ""

Given(/^I login to tinypulse system successfully$/, () => {
   // Load user credentials from json
    cy.fixture('user.json').then(function(data){
    this.data = data

    cy.visit(Cypress.env("url")+"/signin")
    cy.get('#session_email').type(this.data.admin.email)
    cy.get('#session_password').type(this.data.admin.password)
    cy.get('.gtm-sign-in').click()
    cy.wait(7000)
  })
});


Given(/^I go to User Settings page$/, () => {
  // Load user credentials from json
  cy.get(".icon-people-setting").click()
  cy.wait(5000)
  cy.get('.onboarding-people-banner').should('be.visible')
 });


When(/^I create new users$/, () => {
  // Click Add People button
  cy.get('a[href*="invite"]').click()
  cy.wait(5000)
  cy.fixture('user.json').then(function(data){
    this.data = data    
    cy.task('datenow').then((random) => {
      // Add randomString to avoid duplication
      randomString = random
      user1_name = randomString + this.data.user1.firstName
      user2_name = randomString + this.data.user2.firstName
    
      // Add 2 users
      cy.get('input[field="firstName"][refkey="1"]').type(user1_name)
      cy.get('input[field="lastName"][refkey="1"]').type(this.data.user1.lastName)
      cy.get('input[field="email"][refkey="1"]').type(randomString + this.data.user1.email)

      cy.get('input[field="firstName"][refkey="2"]').type(user2_name)
      cy.get('input[field="lastName"][refkey="2"]').type(this.data.user2.lastName)
      cy.get('input[field="email"][refkey="2"]').type(randomString + this.data.user2.email)  
    })
    cy.get('.cucumber-send-invite-button').click()
    cy.wait(3000)
  })
});


When(/^I create existing user$/, () => {
  // Click Add People button
  cy.get('a[href*="invite"]').click()
  cy.wait(5000)

  // Add existing user
  cy.fixture('user.json').then(function(data){
    this.data = data
    cy.get('input[field="firstName"][refkey="1"]').type(this.data.admin.firstName)
    cy.get('input[field="lastName"][refkey="1"]').type(this.data.admin.lastName)
    cy.get('input[field="email"][refkey="1"]').type(this.data.admin.email)
    cy.get('.cucumber-send-invite-button').click()
    cy.wait(3000)
  })
});


Then(/^new users info should display on congratulations page$/, () => {
  cy.get('tbody[data-cucumber="user-list-onboard"] td div').eq(0).invoke('attr', 'data-original-title').should('include', user1_name)
  cy.get('tbody[data-cucumber="user-list-onboard"] td div').eq(8).invoke('attr', 'data-original-title').should('include', user2_name)
});


Then(/^error message should be display on congratulations page$/, () => {
  cy.get('.items-center.red').then(function(msg){
    expect(msg.text()).to.contains('Uh oh! Unable to add user because email already exists')
  })  
})