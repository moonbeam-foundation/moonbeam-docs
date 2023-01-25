You will need to create a Hardhat project if you don't already have one. You can create one by completing the following steps:

1. Create a directory for your project
    ```
    mkdir hardhat && cd hardhat
    ```
2. Initialize the project which will create a `package.json` file
    ```
    npm init -y
    ```
3. Install Hardhat
    ```
    npm install hardhat
    ```
4. Create a project
    ```
    npx hardhat
    ```

    !!! note
        `npx` is used to run executables installed locally in your project. Although Hardhat can be installed globally, it is recommended to install it locally in each project so that you can control the version on a project by project basis.
            
5. A menu will appear which will allow you to create a new project or use a sample project. For this example, you can choose **Create an empty hardhat.config.js**

![Hardhat Create Project](/images/builders/build/eth-api/dev-env/hardhat/hardhat-1.png)

This will create a Hardhat config file (`hardhat.config.js`) in your project directory.

Once you have your Hardhat project, you can also install the [Ethers plugin](https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html){target=_blank}. This provides a convenient way to use the [Ethers.js](/builders/build/eth-api/libraries/ethersjs/){target=_blank} library to interact with the network. To install it, run the following command:

```
npm install @nomiclabs/hardhat-ethers ethers
```
