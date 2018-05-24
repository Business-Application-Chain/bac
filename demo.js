var person = {
    id: '001',
    output: function (name, job) {
        console.log("id: " + this.id + " name: " + name + " job: " + job);
    }
};
person.output('li', 'node developer');

person.id = '002';
person.output.bind(person, 'liz');
person.output('android developer');
