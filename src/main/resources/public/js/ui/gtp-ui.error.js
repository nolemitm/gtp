/**
 * Global Technology Partners, LLC
 * @author Sergio Sanchez
 *
 * Widget gtpUi.error
 * Generic error modal panel
 * Uses Bootstrap v3.3.7
 */

( function( factory ) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define( ["jquery", "jquery-ui/sortable"], factory );
	} else if (typeof exports === "object") {
		// Node/CommonJS
		factory( require( "jquery" ) );
	} else {
		// Browser globals
		factory( jQuery );
	}
}( function( $ ) {

	$.widget( "gtpUi.error", {
		options: {
			modalTitle: "System Error",
			errorMessage: "Error",
			contactSupport: undefined,
			closeBottonText: 'Close',
			isHtml: false,

			// show options
			show: 'show',

			// Callbacks
			onDisplay: function() {

			}
		},
		_create: function() {
			this.message = '<p>' + this.options.errorMessage + '</p>';

			if ( this.options.isHtml ) {
				this.message = $.parseHTML( this.options.errorMessage );
			}

			this.id = this.element.attr("id");
			this.dialogId = this.id + "-dialog";
			this.container = $( '<div class="modal" id=\"' + this.dialogId + '\" tabindex="-1"></div>' ).appendTo( this.element );
			this.modalDialog = $( '<div class="modal-dialog"></div>' ).appendTo( this.container );
			this.modalContent = $( '<div class="modal-content"></div>' ).appendTo( this.modalDialog );

			// <header>
			this.modalHeader = $( '<div class="modal-header"></div>' ).appendTo( this.modalContent );
			// append the close symbol to the header
			$( '<a href="#" class="close" data-dismiss="modal">&times;</a>' ).appendTo( this.modalHeader );
			// append the title
			this.modalTitle = $( '<h4>' + this.options.modalTitle + '</h4>' ).appendTo( this.modalHeader );
			// </header>

			// <body>
			this.modalBody = $( '<div class="modal-body" style="padding-top: 5px;"></div>' ).appendTo( this.modalContent );
			this.errorMessage = $( this.message ).appendTo( this.modalBody );

			if ( this.options.contactSupport ) {
				this.contactSupport = $( '<p>' + this.options.contactSupport + '</p>' ).appendTo( this.modalBody );
			}
			// </body>

			// <footer>
			//this.modalFooter = $( '<div class="modal-footer"></div>' ).appendTo( this.modalContent );
			//this.closeButton = $( '<button class="btn btn-default" data-dismiss="modal">' + this.options.closeBottonText + '</button>' ).appendTo( this.modalFooter );
			// </footer>
		},
		//_show: function(element, show, callback) {
		//	this.container.modal( 'show' );
		//},
		display: function(options) {
			this.option( options );
			this.container.modal( 'show' );		// Bootstrap v3.3.7 dependency
		},
		// _setOptions is called with a hash of all options that are changing
		// always refresh when changing options
		_setOptions: function() {
			// _super and _superApply handle keeping the right this-context
			this._superApply( arguments );
			this._refresh();
		},
		_refresh: function() {
			var title = '<h4>' + this.options.modalTitle + '</h4>';
			this.message = '<p>' + this.options.errorMessage + '</p>';

			if ( this.options.isHtml ) {
				this.message = $.parseHTML( this.options.errorMessage );
				title = $.parseHTML( this.options.modalTitle );
			}

			this.modalTitle.detach();
			this.modalTitle = $( title ).appendTo( this.modalHeader );
			this.errorMessage.detach();
			this.errorMessage = $( this.message ).prependTo( this.modalBody );
			//this.errorMessage.text(this.options.errorMessage);

			if ( this.contactSupport ) {
				this.contactSupport.text(this.options.contactSupport);
			}
			//this.closeButton.text(this.options.closeBottonText);

			this._trigger( "change" );
		},
		_destroy: function() {
			this.container.remove();
		}
	} );

} ) );