/**
 * Person constructor.
 */
export default function Person (firstName, lastName, age = 0) {
  [this.firstName, this.lastName, this.age] =
    [firstName, lastName, age];
}

/**
 * Typical person.
 */
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

Person.thing = {
  /**
   * Foobar!
   */
  value: 'foobar'
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

/**
 * Static property on Person.
 */
Person.taxonomy = 'homo sapien';
