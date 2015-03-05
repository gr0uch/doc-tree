/**
 * This class defines a person.
 *
 * There is another paragraph, and supports **CommonMark**.
 */
export default class Person extends Object {

  /**
   * This is a constructor!
   *
   * @param {String} firstName
   * @param {String} lastName
   * @param {Number} age the person's age
   */
  constructor (firstName, lastName, age = 0) {
    [this.firstName, this.lastName, this.age] =
      [firstName, lastName, age];
  }

  /**
   * Return a name.
   *
   * @return {String}
   */
  get name () {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Set a name.
   *
   * @param {String} name the person's full name
   */
  set name (name) {
    [this.firstName, this.lastName] = name.split(' ');
  }

  /*!
   * This should be ignored.
   */
  // This should also be ignored.
  ignore () {}

  /**
   * This is a method.
   */
  poop () {
    throw new Error('Diarrhea!');
  }

  /**
   * This is a static method.
   */
  static zap () {}

}


/**
 * This sort of prototype assignment won't be detected, need
 * good static analysis to do this. Too complex to handle for now.
 */
Object.assign(Person.prototype, {
  alive: true
});
