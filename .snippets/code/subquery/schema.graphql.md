```
type Transaction @entity {

  id: ID! # Transaction hash

  value: BigInt!

  to: String!

  from: String!

  contractAddress: String!

}

type Approval @entity {

  id: ID! # Transaction hash

  value: BigInt!

  owner: String!

  spender: String!

  contractAddress: String!
  
}
```