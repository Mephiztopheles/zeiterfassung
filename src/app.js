const SEKUNDE = 1000;
const MINUTE  = SEKUNDE * 60;
const STUNDE  = MINUTE * 60;

Date.prototype.clearTime = function () {
    this.setHours(0);
    this.setMinutes(0);
    this.setSeconds(0);
    this.setMilliseconds(0);
    return this;
};

String.prototype.decapitalize = function () {
    return this[0].toLowerCase() + this.substr(1);
};

angular.module( "zeiterfassung", [] ).run( [ "$rootScope", "Projekt", function ( $rootScope, Projekt ) {
    Projekt.list().then( response => {
        $rootScope.projekte = response;
        $rootScope.layout   = "view/zeiterfassung.html";
        console.log( $rootScope );
    } );
} ] ).filter( "dauer", () => ( ms ) => {
    let stunden = Math.floor( ms / 3600000 );
    let minuten = Math.floor( ms / 60000 ) - stunden * 60;
    return `${stunden}:${minuten <= 9 ? "0" + minuten : minuten}`;
} );