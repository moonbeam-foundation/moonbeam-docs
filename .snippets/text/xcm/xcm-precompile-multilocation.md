```js
 struct Multilocation {
    uint8 parents;
    bytes [] interior;
}
```

Note that each multilocation has a `parents` element, defined in this case by a `uint8`, and an array of bytes. Parents refer to how many "hops" in the upwards direction you have to do if you are going through the relay chain. Being a `uint8`, the normal values you would see are:

|   Origin    | Destination | Parents Value |
|:-----------:|:-----------:|:-------------:|
| Parachain A | Parachain A |       0       |
| Parachain A | Relay Chain |       1       |
| Parachain A | Parachain B |       1       |

The bytes array (`bytes[]`) defines the interior and its content within the multilocation. The size of the array defines the `interior` value as follows:

|    Array     | Size | Interior Value |
|:------------:|:----:|:--------------:|
|      []      |  0   |      Here      |
|    [XYZ]     |  1   |       X1       |
|  [XYZ, ABC]  |  2   |       X2       |
| [XYZ, ... N] |  N   |       XN       |

Suppose the bytes array contains data. Each element's first byte (2 hexadecimal numbers) corresponds to the selector of that `XN` field. For example:

| Byte Value |    Selector    | Data Type |
|:----------:|:--------------:|-----------|
|    0x00    |   Parachain    | bytes4    |
|    0x01    |  AccountId32   | bytes32   |
|    0x02    | AccountIndex64 | u64       |
|    0x03    |  AccountKey20  | bytes20   |
|    0x04    | PalletInstance | byte      |
|    0x05    |  GeneralIndex  | u128      |
|    0x06    |   GeneralKey   | bytes[]   |

Next, depending on the selector and its data type, the following bytes correspond to the actual data being provided. Note that for `AccountId32`, `AccountIndex64`, and `AccountKey20`, the `network` field seen in the Polkadot.js Apps example is appended at the end. For example:

|    Selector    |       Data Value       |        Represents         |
|:--------------:|:----------------------:|:-------------------------:|
|   Parachain    |    "0x00+000007E7"     |     Parachain ID 2023     |
|  AccountId32   | "0x01+AccountId32+00"  | AccountId32, Network Any  |
|  AccountKey20  | "0x03+AccountKey20+00" | AccountKey20, Network Any |
| PalletInstance |       "0x04+03"        |     Pallet Instance 3     |

!!! note
    The `interior` data usually needs to be wrapped around quotes. On the contrary, you might get an `invalid tuple value` error.