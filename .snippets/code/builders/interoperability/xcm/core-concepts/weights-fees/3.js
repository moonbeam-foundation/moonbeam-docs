const message = { V3: [instr1, instr2] };

const theWeight = await api.call.xcmPaymentApi.queryXcmWeight(message);
console.log(theWeight);
