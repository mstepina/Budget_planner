function Person () {
    this.age = 0;
    var self = this;

    setInterval(function growUp() {
        console.log(self.age++);
    },1000);
}


var p = new Person();


