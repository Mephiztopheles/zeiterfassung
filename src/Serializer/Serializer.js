class Serializer {
    constructor( data ) {
        for ( let property in data ) {
            if ( data.hasOwnProperty( property ) ) {
                switch ( getType( data[ property ] ) ) {
                    case "null":
                        this[ property ] = null;
                        break;
                    case "object":
                        this[ property ] = new this.constructor( data[ property ] );
                        break;
                    default:
                        this[ property ] = data[ property ].valueOf();
                        break;
                }
            }
        }
        return this;
    }
}