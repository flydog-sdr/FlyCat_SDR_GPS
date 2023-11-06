/*
 * Generated by asn1c-0.9.28 (http://lionet.info/asn1c)
 * From ASN.1 module "FANSACTwoWayDataLinkCommunications"
 * 	found in "../../../libacars.asn1/fans-cpdlc.asn1"
 * 	`asn1c -fcompound-names -fincludes-quoted -gen-PER`
 */

#ifndef	_FANSRunwayDeparture_H_
#define	_FANSRunwayDeparture_H_


#include "asn_application.h"

/* Including external dependencies */
#include "FANSRunway.h"

#ifdef __cplusplus
extern "C" {
#endif

/* FANSRunwayDeparture */
typedef FANSRunway_t	 FANSRunwayDeparture_t;

/* Implementation */
extern asn_TYPE_descriptor_t asn_DEF_FANSRunwayDeparture;
asn_struct_free_f FANSRunwayDeparture_free;
asn_struct_print_f FANSRunwayDeparture_print;
asn_constr_check_f FANSRunwayDeparture_constraint;
ber_type_decoder_f FANSRunwayDeparture_decode_ber;
der_type_encoder_f FANSRunwayDeparture_encode_der;
xer_type_decoder_f FANSRunwayDeparture_decode_xer;
xer_type_encoder_f FANSRunwayDeparture_encode_xer;
per_type_decoder_f FANSRunwayDeparture_decode_uper;
per_type_encoder_f FANSRunwayDeparture_encode_uper;

#ifdef __cplusplus
}
#endif

#endif	/* _FANSRunwayDeparture_H_ */
#include "asn_internal.h"
