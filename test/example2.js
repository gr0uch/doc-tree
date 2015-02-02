/**
 * Old school prototypes.
 */
export default function Person (firstName, lastName, age = 0) {
  [this.firstName, this.lastName, this.age] =
    [firstName, lastName, age];
}

Person.prototype = {

  /**
   * Poop.
   */
  poop: () => {
    throw new Error('Diarrhea!');
  },

  /**
   * Foo.
   */
  foo: 123

};

/**
 * Die.
 */
Person.prototype.die = function () {
  throw new Error('Can\'t die, I\'m immortal.');
};

/**
 * Hmm.
 */
Person.prototype.sex = 'female';
