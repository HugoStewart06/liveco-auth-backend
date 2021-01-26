/* eslint-disable no-undef */
describe('My Login application', () => {
  it('should login with invalid credentials', () => {
    browser.url(`http://localhost:3000/login`);

    $('#email').setValue('notfound@gmail.com');
    $('#password').setValue('notfound');
    $('button[type="submit"]').click();

    const errorMessage = $('#error-message');
    expect(errorMessage).toBeDisplayed();
    expect(errorMessage).toHaveText('wrong email or password');
  });

  it('should login with valid credentials', () => {
    browser.url(`http://localhost:3000/login`);

    $('#email').setValue('foobar@gmail.com');
    $('#password').setValue('abc');
    $('button[type="submit"]').click();

    expect(browser).toHaveUrl('http://localhost:3000/profile');
  });
});
