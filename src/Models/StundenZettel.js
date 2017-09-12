angular.module( environment.name ).service( "StundenZettel", [ "Model", "Projekt", function ( Model, Projekt ) {
    class StundenZettel extends Model {

        get dauer() {
            if ( this.start && this.ende )
                return this.ende.getTime() - this.start.getTime();
            return 0;
        }

        init() {
            if ( !this.start ) {
                this.start = new Date();
            } else if ( !(this.start instanceof Date) ) {
                this.start = new Date( this.start );
            }
            this.start.setSeconds( 0 );
            this.start.setMilliseconds( 0 );
            if ( !this.ende ) {
                this.ende = new Date( this.start.getTime() + 30 * MINUTE );
            } else if ( !(this.ende instanceof Date) ) {
                this.ende = new Date( this.ende );
            }
            this.ende.setSeconds( 0 );
            this.ende.setMilliseconds( 0 );

            if ( this.projekt && !(this.projekt instanceof Projekt) ) {
                this.projekt = new Projekt( this.projekt );
            }

        }
    }

    StundenZettel.controller = "stundenZettel";
    return StundenZettel;
} ] );
