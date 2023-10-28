```js
 struct Multilocation {
    uint8 parents;
    bytes[] interior;
}
```

As with a standard [multilocation](/builders/interoperability/xcm/fundamentals/multilocations){target=_blank}, there are `parents` and `interior` elements. However, instead of defining the multilocation as an object, with Ethereum libraries, the struct is defined as an array, which contains a `uint8` for the `parents` as the first element and a bytes array for the `interior` as the second element.

The normal values you would see for the `parents` element are:

|   Origin    | Destination | Parents Value |
|:-----------:|:-----------:|:-------------:|
| Parachain A | Parachain A |       0       |
| Parachain A | Relay Chain |       1       |
| Parachain A | Parachain B |       1       |

For the `interior` element, the number of fields you need to drill down to in the target chain to reach the exact location of the target, such as the specific asset or account, represents the size of the bytes array:

|    Array     | Size | Interior Value |
|:------------:|:----:|:--------------:|
|      []      |  0   |      Here      |
|    [XYZ]     |  1   |       X1       |
|  [XYZ, ABC]  |  2   |       X2       |
| [XYZ, ... N] |  N   |       XN       |

!!! note
    Interior value `Here` is often used for the relay chain (either as a destination or to target the relay chain asset).

Each field required to reach the exact location of the target needs to be defined as a hex string. The first byte (2 hexadecimal characters) corresponds to the selector of the field. For example:

| Byte Value |    Selector    | Data Type |
|:----------:|:--------------:|-----------|
|    0x00    |   Parachain    | bytes4    |
|    0x01    |  AccountId32   | bytes32   |
|    0x02    | AccountIndex64 | u64       |
|    0x03    |  AccountKey20  | bytes20   |
|    0x04    | PalletInstance | byte      |
|    0x05    |  GeneralIndex  | u128      |
|    0x06    |   GeneralKey   | bytes[]   |

Next, depending on the selector and its data type, the following bytes correspond to the actual data being provided. Note that for `AccountId32`, `AccountIndex64`, and `AccountKey20`, the optional `network` field is appended at the end. For example:

|    Selector    |       Data Value       |             Represents             |
|:--------------:|:----------------------:|:----------------------------------:|
|   Parachain    |    "0x00+000007E7"     |         Parachain ID 2023          |
|  AccountId32   | "0x01+AccountId32+00"  | AccountId32, Network(Option) Null  |
|  AccountId32   | "0x01+AccountId32+03"  |   AccountId32, Network Polkadot    |
|  AccountKey20  | "0x03+AccountKey20+00" | AccountKey20, Network(Option) Null |
| PalletInstance |       "0x04+03"        |         Pallet Instance 3          |

!!! note
    The `interior` data usually needs to be wrapped around quotes, or you might get an `invalid tuple value` error.
