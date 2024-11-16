// import {
//   ContainerType,
//   ByteVectorType,
//   UintNumberType,
//   ListBasicType,
// } from "@chainsafe/ssz";
// import { Address } from "abitype";
//
// const OperatorIDsType = new ListBasicType(new UintNumberType(4), 1024);
// const AddressType = new ByteVectorType(20);
// const NonceType = new UintNumberType(8);
// const NetworkType = new ByteVectorType(32);
// const ProofsStringType = new ByteVectorType(256);
// const OperatorsInfoType = new ByteVectorType(256);
//
// const MyObjectType = new ContainerType({
//   message: {
//     operatorIDs: OperatorIDsType,
//     newOperatorIDs: OperatorIDsType,
//     withdrawAddress: AddressType,
//     owner: AddressType,
//     nonce: NonceType,
//     network: NetworkType,
//     proofsString: ProofsStringType,
//     operatorsInfo: OperatorsInfoType,
//   },
//   proofs: ProofsStringType,
// });
//
// export function encodeToSSZ(data: {
//   message: {
//     operatorIDs: number[];
//     newOperatorIDs?: number[];
//     withdrawAddress: Address;
//     owner: Address;
//     nonce: number;
//     network: string;
//     proofsString: string;
//     operatorsInfo: string;
//   };
//   proofs: string;
// }): Uint8Array {
//   const sszData = {
//     message: {
//       operatorIDs: data.message.operatorIDs,
//       newOperatorIDs: data.message.newOperatorIDs || [],
//       withdrawAddress: Uint8Array.from(
//         Buffer.from(data.message.withdrawAddress.slice(2), "hex"),
//       ),
//       owner: Uint8Array.from(Buffer.from(data.message.owner.slice(2), "hex")),
//       nonce: data.message.nonce,
//       network: Uint8Array.from(Buffer.from(data.message.network, "utf-8")),
//       proofsString: Uint8Array.from(
//         Buffer.from(data.message.proofsString, "utf-8"),
//       ),
//       operatorsInfo: Uint8Array.from(
//         Buffer.from(data.message.operatorsInfo, "utf-8"),
//       ),
//     },
//     proofs: Uint8Array.from(Buffer.from(data.proofs, "utf-8")),
//   };
//   return MyObjectType.serialize(sszData);
// }
//
// // [{
// //   messages: 3
// //   proofs:[{},{}]
// // },{
// //   messages: 3
// //   proofs:
// // }]
//
// // const myObject = {
// //   operatorIDs: [1, 2, 3],
// //   withdrawAddress: "0x1234567890abcdef1234567890abcdef12345678",
// //   owner: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
// //   nonce: 1,
// //   network: "mainnet",
// //   proofsString: "proof_data",
// //   operatorsInfo: "operator_information",
// // };
//
// // const createPayload;
//
// // const encodedBytes = encodeToSSZ(myObject);
// // console.log("asdasdasdasdasd");
// // console.log(toHexString(encodedBytes)); // Outputs encoded data as a hex string
