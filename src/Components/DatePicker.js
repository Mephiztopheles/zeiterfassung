const DatePicker = {
    scope: {
        value   : "=date",
        type    : "@dateType",
        settings: "<"
    },
    link( $scope, $el ) {
        const NAME = "DatePicker";

        function detectmob() {
            return !!(navigator.userAgent.match( /Android/i )
                || navigator.userAgent.match( /webOS/i )
                || navigator.userAgent.match( /iPhone/i )
                || navigator.userAgent.match( /iPad/i )
                || navigator.userAgent.match( /iPod/i )
                || navigator.userAgent.match( /BlackBerry/i )
                || navigator.userAgent.match( /Windows Phone/i ));
        }

        function formatDate( _date2, format ) {
            _date2 = _date2 ? new Date( _date2 ) : null;

            function getDayOfYear() {
                const onejan = new Date( _date2.getFullYear(), 0, 1 );
                return Math.ceil( (_date2 - onejan) / 86400000 );
            }

            function getDaySuffix() {
                const d   = _date2.getDate();
                const sfx = [ "th", "st", "nd", "rd" ];
                const val = d % 100;
                return sfx[ (val - 20) % 10 ] || sfx[ val ] || sfx[ 0 ];
            }

            function getWeek() {
                return Math.ceil( (_date2.getDate() - _date2.getDay()) / 7 );
            }

            function getDay() {
                const d = _date2.getDay();
                return d === 0 ? 7 : d;
            }

            function getWeekOfYear() {
                const onejan = new Date( _date2.getFullYear(), 0, 1 );
                return Math.ceil( ((_date2 - onejan) / 86400000 + onejan.getDay() + 1) / 7 );
            }

            function isLeapYear() {
                const yr = _date2.getFullYear();
                if ( parseInt( yr ) % 4 === 0 ) {
                    if ( parseInt( yr ) % 100 === 0 ) {
                        if ( parseInt( yr ) % 400 !== 0 ) {
                            return false;
                        }
                        if ( parseInt( yr ) % 400 === 0 ) {
                            return true;
                        }
                    }
                    if ( parseInt( yr ) % 100 !== 0 ) {
                        return true;
                    }
                }
                if ( parseInt( yr ) % 4 !== 0 ) {
                    return false;
                }
            }

            function parse() {
                format           = format.split( "" );
                let m            = "";
                const dateFormat = [];
                let gi           = 0, custom = false, i = 0;
                for ( i; i < format.length; i++ ) {
                    custom = format[ i ] === "'" ? !custom : custom;
                    if ( custom ) {
                        if ( format[ i ] != "'" ) {
                            dateFormat[ Math.max( 0, gi - 1 ) ] += format[ i ];
                        } else {
                            dateFormat[ Math.max( 0, gi - 1 ) ] = "";
                        }
                    } else if ( format[ i ] !== "'" ) {
                        if ( format[ i ] == m ) {
                            dateFormat[ gi - 1 ] += format[ i ];
                        } else {
                            dateFormat[ gi ] = format[ i ];
                            gi++;
                        }
                        m = format[ i ];
                    }
                }
                const _date = _date2.getDate(), month = _date2.getMonth(), hours = _date2.getHours(),
                      minutes                                                    = _date2.getMinutes(), seconds                     = _date2.getSeconds();
                const date_props                                                 = {
                    d   : _date,
                    dd  : _date < 10 ? "0" + _date : _date,
                    EE  : $scope.translate( "day.short." + _date2.getDay() )[ 0 ],
                    EEE : $scope.translate( "day.short." + _date2.getDay() ),
                    EEEE: $scope.translate( "day." + _date2.getDay() ),
                    S   : getDaySuffix(),
                    w   : getDay(),
                    z   : getDayOfYear(),
                    WW  : getWeekOfYear(),
                    W   : getWeek(),
                    M   : month + 1,
                    MM  : month < 9 ? "0" + (month + 1) : month + 1,
                    MMM : $scope.translate( "month.short." + _date2.getMonth() ),
                    MMMM: $scope.translate( "month." + _date2.getMonth() ),
                    n   : month + 1,
                    t   : [ 31, isLeapYear() ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ][ _date2.getMonth() ],
                    L   : isLeapYear() ? "1" : "0",
                    yyyy: _date2.getFullYear(),
                    yy  : (_date2.getFullYear() + "").substring( 2, 4 ),
                    a   : hours > 12 ? "pm" : "am",
                    A   : hours > 12 ? "PM" : "AM",
                    g   : hours % 12 > 0 ? hours % 12 : 12,
                    G   : hours > 0 ? hours : "12",
                    h   : hours % 12 > 0 ? hours % 12 : 12,
                    HH  : hours < 10 ? "0" + hours : hours,
                    H   : hours,
                    mm  : minutes < 10 ? "0" + minutes : minutes,
                    m   : minutes,
                    ss  : seconds < 10 ? "0" + seconds : seconds,
                    s   : seconds
                };
                let date_string                                                  = "";
                for ( i = 0; i < dateFormat.length; i++ ) {
                    const f = dateFormat[ i ];
                    if ( f.match( /[a-zA-Z]/g ) && typeof date_props[ f ] !== "undefined" ) {
                        date_string += date_props[ f ];
                    } else {
                        date_string += f;
                    }
                }
                date_string = date_string.replace( /\d/g, "" ) === "" ? date_string : date_string;
                return date_string;
            }

            if ( format && _date2 && _date2 !== "Invalid Date" ) {
                return parse();
            }
        }

        function escapeRegExp( str ) {
            return str.replace( /[\-\[\]\/{}()*+?.\\^$|]/g, "\\$&" );
        }

        function dateToRegex( format ) {
            let regex = "";

            /*if ( format.match( /dd/ ) === null ) {
                format = format.replace( /d/, "dd" );
            }
            if ( format.match( /MM/ ) === null ) {
                format = format.replace( /M/, "MM" );
            }
            if ( format.match( /yyyy/ ) === null ) {
                format = format.replace( /yyy/, "yyyy" ).replace( /yy/, "yyyy" ).replace( /y/, "yyyy" );
            }
            if ( format.match( /HH/ ) === null ) {
                format = format.replace( /H/, "HH" );
            }*/
            for ( let i = format.length; i > 0; i-- ) {
                let str = format.substring( 0, i );
                str     = escapeRegExp( str );
                str     = str.replace( /dd/g, "(?:0[1-9]|1[0-9]|2[0-9]|3[0-1])" ).replace( /MM/g, "(?:0[1-9]|1[0-2])" ).replace( /yyyy/g, "[0-9]{4}" ).replace( /yyy/g, "[0-9]{3}" ).replace( /yy/g, "[0-9]{2}" ).replace( /y/g, "[0-9]" ).replace( /mm/g, "(?:(?:0|1|2|3|4|5)[0-9])" ).replace( /HH/g, "(?:0[0-9]|1[0-9]|2[0-3])" );
                if ( format[ i + 1 ] === "d" ) {
                    str = str.replace( /d/, "[0-3]" );
                } else {
                    str = str.replace( /d/, "[1-9][0-9]?" );
                }
                if ( format[ i + 1 ] === "M" ) {
                    str = str.replace( /M/, "[0-1]" );
                } else {
                    str = str.replace( /M/, "[1-9][0-9]?" );
                }
                if ( format[ i + 1 ] === "m" ) {
                    str = str.replace( /m/, "[0-5]" );
                } else {
                    str = str.replace( /m/, "[0-9][0-9]?" );
                }
                if ( format[ i + 1 ] === "H" ) {
                    str = str.replace( /H/, "[0-2]" );
                } else {
                    str = str.replace( /H/, "[0-9][0-9]?" );
                }
                regex += "(^" + str + "$)";
                if ( i !== 1 ) {
                    regex += "|";
                }
            }
            /*for ( var i = format.length; i > 0; i-- ) {
                var str = format.substring( 0, i );
                str     = escapeRegExp( str );
                str     = str.replace( /dd/g, "(?:0[1-9]|1[0-9]|2[0-9]|3[0-1])" )
                .replace( /d/g, "(?:[0-9]|1[0-9]|2[0-9]|3[0-1])" )
                .replace( /MM/g, "(?:0[1-9]|1[0-2])" )
                .replace( /M/g, "(?:[0-9]|1[0-2])" )
                .replace( /y/g, "[0-9]" )
                .replace( /HH/g, "(?:0[1-9]|1[0-9]|2[0-4])" )
                .replace( /H/g, "(?:[0-9]|1[0-9]|2[0-4])" )
                .replace( /mm/g, "(?:0[1-9]|(?:1|2|3|4|5)[0-9])" )
                .replace( /m/g, "(?:[0-9]|(?:1|2|3|4|5)[0-9])" )
                .replace( /'(.+)'/, "$1" );
                regex += "(^" + str + "$)";
                if ( i !== 1 ) {
                    regex += "|"
                }
            }*/
            return new RegExp( regex );
        }

        function encode( date, format ) {
            format = format || $scope.settings.format;
            return formatDate( date, format );
        }

        function setCursor( type, value, max ) {
            html[ type + "Cursor" ].css( "left", (html[ type + "Slider" ].width() / (max - 1) * value) );
        }

        $scope.$watch( "value", function ( value ) {
            if ( value ) {
                $el.val( encode( $scope.value ) );
                if ( $scope.settings.time ) {
                    setCursor( "hour", $scope.value.getHours(), 24 );
                    setCursor( "minute", $scope.value.getMinutes(), 60 );
                }
            }
        }, true );

        $el.addClass( NAME + "-element" );


        let oldValue = $el.val(),
            compileTimer;
        $el.off( "." + NAME ).on( "keydown." + NAME, function ( e ) {
            setTimeout( function () {
                if ( (e.which | e.keyCode) === 9 ) {
                    $scope.close();
                }
            }, 2 );
        } ).on( "focus." + NAME + " touchstart." + NAME, function ( e ) {
            if ( detectmob() && $scope.settings.preventMobileKeyboard ) {
                $el.attr( "readonly", "readonly" );
                e.preventDefault();
                e.stopPropagation();
                $( "body" ).on( "click." + NAME, function ( e ) {
                    if ( !$( e.target ).closest( "#" + NAME + "-dialog" ).length ) {
                        $( "body" ).off( "click." + NAME );
                        $scope.close();
                    }
                } );
            }
            if ( !$scope.visible && $scope.settings.query( $el ) ) {
                $scope.open();
            }
        } ).on( "blur." + NAME, function ( event ) {
            $scope.close( !!event.relatedTarget );
        } ).on( "keypress." + NAME + " paste." + NAME, function ( e ) {
            if ( !$scope.decodeCompatibility() ) {
                $el.attr( "readonly", "readonly" );
            } else {
                setTimeout( () => {
                    const regex = dateToRegex( $scope.settings.format ),
                          exec  = regex.exec( this.value );
                    if ( exec === null ) {
                        if ( this.value ) {
                            this.value = oldValue;
                            e.preventDefault();
                            e.stopPropagation();
                        } else {
                            $scope.clear();
                        }
                    } else if ( exec[ 1 ] ) {
                        clearTimeout( compileTimer );
                        compileTimer = setTimeout( () => {
                            $scope.select( $scope.decode( this.value ) );
                            $scope.close();
                        }, 40 );
                    }
                    oldValue = this.value;
                }, 1 );
            }
        } );


        $scope.open                = function () {
            if ( !$el[ 0 ].disabled ) {
                if ( this.settings.free ) {
                    $( "body" ).append( html.wrapper ).addClass( NAME );
                    html.wrapper.append( html.dialog );
                } else {
                    $( "body" ).append( html.dialog.css( "position", "absolute" ) ).addClass( NAME );
                }
                html.dialog.append( html.inner );
                html.inner.append( html.header ).append( html.body ).append( html.footer );
                html.header.append( html.previous.append( html.previousArrow ) ).append( html.title ).append( html.next.append( html.nextArrow ) );
                html.body.html( html.calendar );
                html.footer.html( html.close ).append( html.today ).append( html.clear );

                html.dialog.hide();
                html.today.removeClass( "disabled" );
                if ( $scope.settings.max ) {
                    if ( $scope.current > $scope.settings.max ) {
                        $scope.current = new Date( $scope.settings.max.getFullYear(), $scope.settings.max.getMonth(), $scope.settings.max.getDate() );
                    }
                    if ( $scope.today > $scope.settings.max ) {
                        html.today.addClass( "disabled" );
                    }
                }
                if ( $scope.settings.min ) {
                    if ( $scope.current < $scope.settings.min ) {
                        $scope.current = new Date( $scope.settings.min.getFullYear(), $scope.settings.min.getMonth(), $scope.settings.min.getDate() );
                    }
                    if ( $scope.today < $scope.settings.min ) {
                        html.today.addClass( "disabled" );
                    }
                }


                function show() {
                    html.dialog.show();
                    $scope.visible = true;
                    $scope.create();
                    $scope.settings.onOpen.call( $scope );
                }

                if ( $scope.settings.animated ) {
                    setTimeout( function () {
                        show();
                        html.dialog.addClass( "show" ).removeClass( "hide" );
                    }, 0 );
                } else {
                    show();
                }
            }

            return $scope;
        };
        $scope.close               = function ( imediate ) {
            if ( !html.dialog.hasClass( "hide" ) ) {
                $el.unbind( "." + NAME + ":prevent" );
                html.title.removeClass( NAME + "-year-open" );

                function hide() {
                    html.wrapper.remove();
                    html.dialog.remove();
                    html.calendar.children().remove();
                    html.header.children().remove();
                    html.title.children().remove();
                    $el.unbind( "." + NAME + ":prevent" );
                    $el[ 0 ].blur();
                    $scope.visible = false;
                    $scope.settings.onClose.call( $scope );
                    $( "body" ).removeClass( NAME );
                    if ( detectmob() && $scope.settings.preventMobileKeyboard ) {
                        $el[ 0 ].removeAttribute( "readonly" );
                    }
                }

                if ( !imediate && $scope.settings.animated ) {
                    setTimeout( hide, $scope.settings.animated );
                    html.dialog.addClass( "hide" ).removeClass( "show" );
                } else {
                    hide();
                }
            }

            return $scope;
        };
        $scope.update              = function () {
            html.calendar.html( "" );
            html.title.html( html.month.html( $scope.translate( "month." + $scope.current.getMonth() ) ) ).append( html.year.html( $scope.current.getFullYear() ) );
            $scope.create();
        };
        $scope.create              = function () {
            let current,
                i = 0,
                n = 0;
            if ( this.settings.checkMinAndMax ) {
                if ( this.settings.max ) {
                    if ( this.settings.max < this.current ) {
                        this.current = new Date( this.settings.max.getFullYear(), this.settings.max.getMonth(), this.settings.max.getDate() );
                    }
                }
                if ( this.settings.min ) {
                    if ( this.settings.min > this.current ) {
                        this.current = new Date( this.settings.min.getFullYear(), this.settings.min.getMonth(), this.settings.min.getDate() );
                    }
                }
            }
            html.title.append( html.month.html( this.translate( "month." + this.current.getMonth() ) ) ).append( html.year.html( this.current.getFullYear() ) );
            html.title.append( html.yearChanger );
            html.yearChanger.children().remove();
            let c;
            current = new Date( this.current.getFullYear(), this.current.getMonth(), 1 );
            if ( current.getDay() !== 1 && current.getDay() !== 0 ) {
                c       = new Date( this.current.getFullYear(), this.current.getMonth(), 0 );
                current = new Date( this.current.getFullYear(), this.current.getMonth() - 1, (c.getDate() - current.getDay() + 2) );
            } else if ( current.getDay() === 0 ) {
                c       = new Date( this.current.getFullYear(), this.current.getMonth(), 0 );
                current = new Date( this.current.getFullYear(), this.current.getMonth() - 1, (c.getDate() - 5) );
            } else {
                c       = new Date( this.current.getFullYear(), this.current.getMonth(), 0 );
                current = new Date( this.current.getFullYear(), this.current.getMonth() - 1, (c.getDate() - 6) );
            }
            current.clearTime();
            const ul = $( "<ul/>" );

            function change( li, y ) {
                li.on( "click", function () {
                    $scope.setYear( y );
                } );
            }

            html.yearChanger.append( ul );
            let yearFrom = this.current.getFullYear() - this.settings.yearBottom,
                yearTo   = this.current.getFullYear() + this.settings.yearTop;
            if ( this.settings.max ) {
                yearTo   = Math.min( yearTo, this.settings.max.getFullYear() );
                yearFrom = yearTo - this.settings.yearBottom - this.settings.yearTop;
                if ( this.settings.min ) {
                    yearFrom = Math.max( yearFrom, this.settings.min.getFullYear() );
                }
            }
            else if ( this.settings.min ) {
                yearFrom = Math.max( yearFrom, this.settings.min.getFullYear() );
                yearTo   = yearFrom + this.settings.yearBottom + this.settings.yearTop;
                if ( this.settings.max ) {
                    yearTo = Math.min( yearTo, this.settings.max.getFullYear() );
                }
            }
            for ( yearTo; yearTo >= yearFrom; yearTo-- ) {
                let li = $( "<li/>", { html: this.translate( "month." + this.current.getMonth() ) + " " + yearTo } );
                ul.append( li );
                change( li, yearTo );
            }

            html.days = [];
            html.rows = [];

            html.calendar.children().remove();
            if ( this.settings.showWeekHeader ) {
                const rowh = $( "<div/>", {
                    id: NAME + "-rowh"
                } );
                html.calendar.append( rowh );

                function createHeader( day ) {
                    const u = $( "<div/>", {
                        id     : NAME + "-rowh-" + day,
                        "class": NAME + "-rowh",
                        html   : $scope.translate( "day.short." + day )
                    } );
                    rowh.append( u );
                }

                createHeader( 1 );
                createHeader( 2 );
                createHeader( 3 );
                createHeader( 4 );
                createHeader( 5 );
                createHeader( 6 );
                createHeader( 7 );

            }
            while ( i < 6 ) {
                i++;
                html.rows[ i ] = $( "<div/>", {
                    id     : NAME + "-row-" + i,
                    "class": NAME + "-row"
                } );
                html.calendar.append( html.rows[ i ] );
                let day = 0;
                while ( day < 7 ) {
                    day++;
                    n++;
                    const d = $( "<div/>", {
                        id     : NAME + "-day-" + n,
                        "class": NAME + "-day" + " " + NAME + "-button",
                        html   : current.getDate()
                    } ).data( "date", current.getTime() );

                    if ( this.settings.min && current.getTime() < new Date( this.settings.min ).getTime() ) {
                        d.addClass( "disabled" );
                    }
                    if ( this.settings.max && current.getTime() > new Date( this.settings.max ).getTime() ) {
                        d.addClass( "disabled" );
                    }
                    if ( current.getMonth() !== this.current.getMonth() ) {
                        d.addClass( NAME + "-day-extern" );
                    }
                    if ( current.clearTime().getTime() === $scope.today.getTime() ) {
                        d.addClass( NAME + "-day-today" );
                    }
                    if ( $scope.selected && current.getTime() === (new Date( $scope.selected )).clearTime().getTime() ) {
                        d.addClass( NAME + "-active" );
                    }

                    current = new Date( current.setDate( current.getDate() + 1 ) );
                    html.days.push( d );
                    html.rows[ i ].append( d );

                }
            }

            const width = html.body.outerWidth() / 7;
            $( html.days ).each( function () {
                $( this ).css( {
                    width: parseInt( width + 1 - parseInt( $( this ).css( "paddingLeft" ) ) - parseInt( $( this ).css( "paddingRight" ) ) )
                } );
            } );
            $( "." + NAME + "-rowh" ).each( function () {
                $( this ).css( {
                    width: parseInt( width + 1 - parseInt( $( this ).css( "paddingLeft" ) ) - parseInt( $( this ).css( "paddingRight" ) ) )
                } );
            } );
            if ( this.settings.time ) {
                html.calendar.append( html.hour );
                html.calendar.append( html.minute );

                html.hour.append( html.hourSlider );
                html.hour.append( html.hourCursor );

                html.minute.append( html.minuteSlider );
                html.minute.append( html.minuteCursor );
                if ( $scope.settings.time ) {
                    setCursor( "hour", $scope.hour, 24 );
                    setCursor( "minute", $scope.minute, 60 );
                }
            }

            if ( this.settings.free ) {
                html.dialog.css( {
                    marginTop : (window.innerHeight - html.dialog.outerHeight()) / 2,
                    marginLeft: (window.innerWidth - html.dialog.outerWidth()) / 2
                } );
            } else {
                const css = {
                    left: this.element.offset().left,
                    top : this.element.offset().top + this.element.outerHeight( true )
                };
                if ( css.top + html.dialog.outerHeight( true ) > window.innerHeight ) {
                    css.top = this.element.offset().top - html.dialog.outerHeight();
                }
                html.dialog.css( css );
            }

            this.addEventListener();
            return this;
        };
        $scope.addEventListener    = function () {

            for ( let i = 0; i < html.days.length; i++ ) {
                $( html.days[ i ] ).on( "click", function ( e ) {
                    if ( !$( this ).hasClass( "disabled" ) ) {
                        const date = new Date( $( this ).data( "date" ) );
                        date.setMinutes( $scope.minute );
                        date.setHours( $scope.hour );
                        $scope.select( date );
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                } );
            }

            html.dialog.off( "mousedown" ).on( "mousedown", function ( e ) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            } );
            if ( this.settings.time ) {
                function setTime( e, type, max ) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    const margin = (html[ type ].width() - html[ type + "Slider" ].width()) / 2,
                          left   = ((e.touches && e.touches[ 0 ] ? e.touches[ 0 ].pageX : e.pageX) - html[ type + "Slider" ].offset().left ) / (html.hour.width() - margin * 2);
                    let value    = parseInt( left * max );
                    if ( value < 0 ) {
                        value = 0;
                    } else if ( value > max - 1 ) {
                        value = max - 1;
                    }
                    html[ type + "Cursor" ].css( "left", (html[ type + "Slider" ].width() / (max - 1) * value) );
                    return value;
                }

                html.hour.off( "mousedown touchstart" ).on( "mousedown touchstart", function ( e ) {
                    if ( $scope.value ) {
                        let old     = $scope.hour;
                        $scope.hour = setTime( e, "hour", 24 );
                        $scope.value.setHours( $scope.hour );
                        if ( old !== $scope.hour ) {
                            $scope.select( new Date( $scope.value ) );
                        }
                        $( document ).on( "mousemove." + NAME + " touchmove." + NAME, function ( e ) {
                            old         = $scope.hour;
                            $scope.hour = setTime( e, "hour", 24 );
                            $scope.value.setHours( $scope.hour );
                            if ( old !== $scope.hour ) {
                                $scope.select( new Date( $scope.value ) );
                            }
                        } ).on( "mouseup." + NAME + " touchend." + NAME, function ( e ) {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                            $( document ).off( "." + NAME );
                        } );
                    }
                } );
                html.minute.off( "mousedown touchstart" ).on( "mousedown touchstart", function ( e ) {
                    if ( $scope.value ) {
                        let old       = $scope.minute;
                        $scope.minute = setTime( e, "minute", 60 );
                        $scope.value.setMinutes( $scope.minute );
                        if ( old !== $scope.minute ) {
                            $scope.select( new Date( $scope.value ) );
                        }
                        $( document ).on( "mousemove." + NAME + " touchmove." + NAME, function ( e ) {
                            old           = $scope.minute;
                            $scope.minute = setTime( e, "minute", 60 );
                            $scope.value.setMinutes( $scope.minute );
                            if ( old !== $scope.minute ) {
                                $scope.select( new Date( $scope.value ) );
                            }
                        } ).on( "mouseup." + NAME + " touchend." + NAME, function ( e ) {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                            $( document ).off( "." + NAME );
                        } );
                    }
                } );
            }

            html.clear.off( "click" ).on( "click", function () {
                $scope.clear();
            } );

            html.dialog.off( "." + NAME ).on( "selectstart." + NAME, function ( event ) {
                "use strict";
                event.preventDefault();
            } );

            html.close.off( "click" ).on( "click", function () {
                $scope.close();
            } );

            html.title.off( "click" ).on( "click", function () {
                html.title.toggleClass( NAME + "-year-open" );
            } );

            html.today.off( "click" ).on( "click", function () {
                let dis = false;
                if ( $scope.settings.max && $scope.today > $scope.settings.max ) {
                    dis = true;
                }
                if ( $scope.settings.min && $scope.today < $scope.settings.min ) {
                    dis = true;
                }

                if ( !dis ) {
                    const d = new Date( $scope.today );
                    d.setHours( $scope.hour );
                    d.setMinutes( $scope.minute );
                    $scope.select( d );
                    $scope.current = $scope.today;
                    $scope.close();
                }
            } );

            html.next.off( "click" ).on( "click", function () {
                $scope.current = new Date( $scope.current.getFullYear(), $scope.current.getMonth() + 1, 1 );
                $scope.update();
            } );

            html.previous.off( "click" ).on( "click", function () {
                $scope.current = new Date( $scope.current.getFullYear(), $scope.current.getMonth() - 1, 1 );
                $scope.update();
            } );

            return this;
        };
        $scope.select              = function ( date ) {
            $scope.$apply( () => {
                if ( (this.settings.min && this.settings.min.getTime() > date.getTime()) || (this.settings.max && this.settings.max.getTime() < date.getTime()) ) {
                    $scope.close();
                    return;
                }
                $el.val( $scope.encode( date ) );
                $scope.value = date;
                if ( typeof $scope.settings.onSelect === "function" ) {
                    $scope.settings.onSelect( $scope.value );
                }
                if ( !$scope.settings.time ) {
                    $scope.close();
                }
            } );
            return this;
        };
        $scope.encode              = function ( date, format ) {
            format = format || $scope.settings.format;
            return formatDate( date, format );
        };
        $scope.decode              = function ( date ) {
            if ( $scope.decodeCompatibility() ) {
                let format = $scope.settings.format;

                function decodePart( code ) {
                    let part;
                    let i = format.indexOf( code + code );
                    if ( ~i ) {
                        return date.substring( i, i + 2 );
                    }
                    i = format.indexOf( code );
                    if ( ~i ) {
                        part = date.substring( i, i + 1 );
                        if ( date.substring( i + 1, i + 2 ).match( /[0-9]/ ) ) {
                            format = format.replace( code, code + code );
                            return decodePart( code );
                        }
                    }
                    return part;
                }

                const list = [];
                let parts  = {};

                [ "d", "m", "H", "M", "y" ].forEach( function ( code ) {
                    let index = format.indexOf( code );
                    if ( ~index ) {
                        list.push( { code: code, index: index } );
                    }
                } );

                list.sort( function ( a, b ) {
                    return a.index > b.index;
                } ).forEach( function ( item ) {
                    if ( item.code === "y" ) {
                        let i = format.indexOf( "yyyy" );
                        if ( ~i ) {
                            parts.y = date.substring( i, i + 4 );
                        } else {
                            i = format.indexOf( "yy" );
                            if ( ~i ) {
                                parts.y = date.substring( i, i + 2 );
                                if ( parts.y ) {
                                    parts.y = $scope.today.getFullYear().toString().substring( 0, 2 ) + parts.y;
                                }
                            }
                        }
                    } else {
                        parts[ item.code ] = decodePart( item.code );
                    }
                } );

                parts = {
                    d: parseInt( parts.d || 0 ),
                    m: parseInt( parts.m || 0 ),
                    y: parseInt( parts.y || 0 ),
                    H: parseInt( parts.H || 0 ),
                    M: parseInt( parts.M || 1 ) - 1
                };
                return new Date( parts.y, parts.M, parts.d, parts.H, parts.m );
            }
        };
        $scope.translate           = function ( key ) {
            const l = translation[ navigator.language ] ? navigator.language : "en";
            return translation[ l ][ key ];
        };
        $scope.setYear             = function ( year ) {
            this.current.setYear( year );
            this.create();
        };
        $scope.clear               = function () {
            this.element.val( "" );
            $scope.selected = null;
            this.current    = this.today;
            if ( typeof this.settings.onSelect === "function" ) {
                this.settings.onSelect( $scope.selected );
            }
            this.close();
        };
        $scope.decodeCompatibility = function () {
            return !this.settings.format.match( /EE+|'|S|w|z|W|n|t|L|a|A|g|G|s/ );
        };

        const translation = {
            de: {
                "month.0"     : "Januar",
                "month.1"     : "Februar",
                "month.2"     : "M&auml;rz",
                "month.3"     : "April",
                "month.4"     : "Mai",
                "month.5"     : "Juni",
                "month.6"     : "Juli",
                "month.7"     : "August",
                "month.8"     : "September",
                "month.9"     : "Oktober",
                "month.10"    : "November",
                "month.11"    : "Dezember",
                "day.1"       : "Montag",
                "day.2"       : "Dienstag",
                "day.3"       : "Mittwoch",
                "day.4"       : "Donnerstag",
                "day.5"       : "Freitag",
                "day.6"       : "Samstag",
                "day.0"       : "Sonntag",
                "day.short.1" : "Mo",
                "day.short.2" : "Di",
                "day.short.3" : "Mi",
                "day.short.4" : "Do",
                "day.short.5" : "Fr",
                "day.short.6" : "Sa",
                "day.short.0" : "So",
                "button.close": "Schlie&szlig;en",
                "button.today": "Heute",
                "button.clear": "L&ouml;schen"
            },
            en: {
                "month.0"     : "January",
                "month.1"     : "February",
                "month.2"     : "March",
                "month.3"     : "April",
                "month.4"     : "May",
                "month.5"     : "June",
                "month.6"     : "July",
                "month.7"     : "August",
                "month.8"     : "September",
                "month.9"     : "October",
                "month.10"    : "November",
                "month.11"    : "December",
                "day.1"       : "Monday",
                "day.2"       : "Tuesday",
                "day.3"       : "Wednesday",
                "day.4"       : "Thursday",
                "day.5"       : "Friday",
                "day.6"       : "Saturday",
                "day.0"       : "Sunday",
                "day.short.1" : "Mo",
                "day.short.2" : "Tu",
                "day.short.3" : "We",
                "day.short.4" : "Th",
                "day.short.5" : "Fr",
                "day.short.6" : "Sa",
                "day.short.0" : "Su",
                "button.close": "Close",
                "button.today": "Today",
                "button.clear": "Clear"
            }
        };
        const html        = {
            wrapper      : $( "<div/>", {
                id: NAME + "-wrapper"
            } ),
            dialog       : $( "<div/>", {
                id: NAME + "-dialog"
            } ).attr( "onselectstart", function () {
                return false;
            } ),
            inner        : $( "<div/>", {
                id: NAME + "-inner"
            } ),
            previous     : $( "<div/>", {
                id     : NAME + "-previous",
                "class": NAME + "-button"
            } ),
            previousArrow: $( "<div/>", {
                "class": NAME + "-arrow"
            } ),
            next         : $( "<div/>", {
                id     : NAME + "-next",
                "class": NAME + "-button"
            } ),
            nextArrow    : $( "<div/>", {
                "class": NAME + "-arrow"
            } ),
            title        : $( "<div/>", {
                id: NAME + "-title"
            } ),
            year         : $( "<span/>", {
                id: NAME + "-year"
            } ),
            yearChanger  : $( "<div/>", {
                id: NAME + "-year-changer"
            } ),
            month        : $( "<span/>", {
                id: NAME + "-month"
            } ),
            header       : $( "<div/>", {
                id: NAME + "-header"
            } ),
            body         : $( "<div/>", {
                id: NAME + "-body"
            } ),
            footer       : $( "<div/>", {
                id: NAME + "-footer"
            } ),
            close        : $( "<div/>", {
                id     : NAME + "-close",
                "class": NAME + "-button",
                html   : $scope.translate( "button.close" )
            } ),
            today        : $( "<div/>", {
                id     : NAME + "-today",
                "class": NAME + "-button",
                html   : $scope.translate( "button.today" )
            } ),
            clear        : $( "<div/>", {
                id     : NAME + "-clear",
                "class": NAME + "-button",
                html   : $scope.translate( "button.clear" )
            } ),
            calendar     : $( "<div/>", {
                id: NAME + "-calendar"
            } ),
            hour         : $( "<div>", {
                id: NAME + "-hour-wrapper"
            } ),
            hourSlider   : $( "<div>", {
                id: NAME + "-hour-slider"
            } ),
            hourCursor   : $( "<div>", {
                id: NAME + "-hour-cursor"
            } ),
            minute       : $( "<div>", {
                id: NAME + "-minute-wrapper"
            } ),
            minuteSlider : $( "<div>", {
                id: NAME + "-minute-slider"
            } ),
            minuteCursor : $( "<div>", {
                id: NAME + "-minute-cursor"
            } ),
            days         : [],
            rows         : []
        };
        $scope.settings   = angular.extend( {
            format               : "dd.MM.yyyy HH:mm",
            time                 : true,
            animated             : 300,
            onSelect             : function () {
            },
            onOpen               : function () {
            },
            onClose              : function () {
            },
            query                : function () {
                return true;
            },
            current              : false,
            free                 : true,
            showWeekHeader       : true,
            min                  : false,
            max                  : false,
            yearTop              : 20,
            yearBottom           : 50,
            yearStatic           : false,
            checkMinAndMax       : true,
            preventMobileKeyboard: true
        }, $scope.settings );
        $scope.visible    = false;
        $scope.calculate  = {
            day   : 24 * 60 * 60 * 1000,
            hour  : 60 * 60 * 1000,
            minute: 60 * 1000,
            second: 1000
        };
        $scope.today      = (new Date()).clearTime();
        $scope.current    = $el.val() ? $scope.decode( $el.val() ) : $scope.settings.current || new Date();
        $scope.hour       = $scope.value && $scope.value.getHours() || 0;
        $scope.minute     = $scope.value && $scope.value.getMinutes() || 0;

    }
};

angular.module( environment.name ).directive( "date", function () {
    return DatePicker;
} );