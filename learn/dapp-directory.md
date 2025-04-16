---
title: List your Dapp on the Moonbeam DApp Directory
description: Follow this tutorial to learn how to list your Moonbeam or Moonriver project or update a current listing on the Moonbeam Foundation DApp Directory.
dropdown_description: Explore the DApp Directory and listing process
---

# How to List your Project on the Moonbeam DApp Directory

## Introduction to The Moonbeam DApp Directory {: #introduction-to-state-of-the-dapps }

The Moonbeam ecosystem comprises two distinct production networks: Moonbeam and Moonriver. Each network has its own dedicated [DApp Directory](https://apps.moonbeam.network/moonbeam/app-dir){target=\_blank}, maintained by the Moonbeam Foundation. These directories categorize projects spanning from DeFi to NFTs to gaming, providing users with comprehensive access to diverse applications.

You'll supply core project details like name, description, and relevant links when adding your project. Depending on your project type, you may include additional data such as on-chain stats and token information.

Despite the distinction between the Moonbeam and Moonriver DApp directories, the submission process remains the same. To list your project on the DApp Directory, you must submit a pull request to the [Moonbeam Foundation's App Directory Data repository on GitHub](https://github.com/moonbeam-foundation/app-directory-data){target=\_blank}. This guide outlines the necessary data and formatting specifics for your submission.

![The Moonbeam DApp Directory home page](/images/learn/dapps-list/directory-1.webp)

## Overview of the Project Data {: #overview-project-data }

There are four main sources of data that are used for a project's listing in the Moonbeam DApp Directory:

- **Core Project Data** - core project data such as descriptions, logos, and screenshots. This data also includes IDs used to query data from external platforms
- **Active Users and Transaction Volume** - on-chain data based on smart contract activity for all of the contracts associated with the project. Data is discovered via the use of contract labeling in Moonscan, which is then indexed by Web3Go and consumed by the DApp Directory
- **TVL Data** - TVL data for the protocol, sourced from the project's listing on DefiLlama
- **Project Token Information** - token information, which is sourced from the project's listing on CoinGecko

## Prerequisites for Using External Data Sources {: #configuring-external-data-sources }

Before pulling data from the mentioned sources, certain prerequisites must be fulfilled. However, it's worth noting that these steps may not apply to all project types. For instance, in the case of wallets, where there are no smart contracts, the DApp Directory is currently unable to display user and transaction activity data.

### Configure the Data Source for Active Users and Transaction Volume {: #configure-active-users }

For projects that have smart contracts deployed on Moonbeam or Moonriver, it is important that those contracts can be linked to the DApp Directory project data.

The end-to-end flow for linking smart contract activity to the DApp Directory is as follows:

1. The smart contract owner fills in the [form to label contracts on Moonscan](https://moonscan.io/contactus?id=5){target=\_blank}
2. The contracts become labeled in Moonscan
3. Periodically, the entire list of labeled contracts is exported and transmitted to Web3Go to be ingested
4. Every hour, Web3Go loads smart contract activity within Moonbeam and Moonriver and runs a job to index this data by the labels

To get your project's smart contracts properly labeled on [Moonscan](https://moonscan.io){target=\_blank}, please refer to Web3Go's documentation on the [Labeling Structure](https://dinlol.gitbook.io/moonscan-smart-contract-label-for-projects/labeling-structure){target=\_blank} and [How to Submit Contract Information](https://dinlol.gitbook.io/moonscan-smart-contract-label-for-projects/how-to-submit-contract-information){target=\_blank} on Moonscan.

Once you've labeled your smart contracts and are ready to submit your project to the DApp Directory, configuring the Directory to utilize your smart contract data becomes straightforward. You'll only need the **Project** component of your labeled contracts.

Consider the following example project with two smart contracts: a Comptroller and a Router recently updated to a new version.

|  Project   | Contract Name | Contract Version |      Resulting Label       |
|:----------:|:-------------:|:----------------:|:--------------------------:|
| My Project |  Comptroller  |        V1        | My Project: Comptroller V1 |
| My Project |    Router     |        V2        |   My Project: Router V2    |

To submit your project to the Moonbeam DApp Directory, ensure you have your **Project** name ready, identified here as `My Project`.

If you're ready to add your project to the DApp Directory, skip to the [How to Submit Your Project Listing](#how-to-submit-your-project-listing) section.

### Configure the Data Source for TVL {: #configure-tvl }

If the project represents a DeFi protocol with TVL (whereby value is locked in the protocol's smart contract), it is possible to display TVL in the Moonbeam DApp Directory.

TVL data is pulled from [DefiLlama](https://defillama.com){target=\_blank}, so you must list your project there. To get your project listed, please refer to DefiLlama's documentation on [How to list a DeFi project](https://docs.llama.fi/list-your-project/submit-a-project){target=\_blank}.

After listing your project, you can easily configure the DApp Directory to pull data from DefiLlama. To do so, you'll need the DefiLlama identifier, which you can find in the URL for your protocol's page. For example, the URL for Moonwell's page is `https://defillama.com/protocol/moonwell`, so the identifier is `moonwell`.

If you have the identifier and are ready to submit your project to the Moonbeam DApp Directory, skip to the [How to Submit Your Project Listing](#how-to-submit-your-project-listing) section.

### Configure the Data Source for Project Token Information {: #project-token-information }

If a project has a token, it is possible to display the name of the token, current price, and contract in the DApp Directory.

However, the data is pulled from [CoinGecko](https://www.coingecko.com){target=\_blank}, so the project's token must be listed there. If your token is not listed there, you can complete [CoinGecko's Request Form](https://www.coingecko.com/request){target=\_blank} to initiate the listing process.

Assuming your project's token is listed there, you must obtain the CoinGecko **API ID** value. You can find the **API ID** value in the **Information** section of the token's page on CoinGecko. For example, the **API ID** on [Moonwell's token page](https://www.coingecko.com/en/coins/moonwell){target=\_blank} is `moonwell-artemis`.

If you have the CoinGecko ID and are ready to submit your project to the Moonbeam DApp Directory, you can continue to the next section.

## How to Submit Your Project Listing {: #how-to-submit-your-project-listing }

As mentioned, you must submit a pull request to the Moonbeam Foundation's GitHub repository that holds the DApp Directory's data. Before getting started, it's worth noting that to expedite the review process, the GitHub user who submits the pull request is recommended to be a major contributor to the project's GitHub so that the Moonbeam Foundation can quickly verify that they represent the project. You can check out the [Review Process](#review-process) section for more information.

To begin, you have two options for adding your project information to the [`app-directory-data` repository on GitHub](https://github.com/moonbeam-foundation/app-directory-data){targe\_blank}. You can utilize [GitHub's browser-based editor](https://github.dev/moonbeam-foundation/app-directory-data){target=\_blank}, which offers a user-friendly interface.

![The app-directory-data repository loaded on GitHub's browser-based editor](/images/learn/dapps-list/directory-2.webp)

Or you can clone the repository locally and make modifications using your preferred code editor, in which you can use the following command to clone the repository:

```bash
git clone https://github.com/moonbeam-foundation/app-directory-data.git
```

Once you've cloned the project, you can create a new branch to which you will add all of your changes. To do this on the browser-based editor, take the following steps:

1. Click on the current branch name in the bottom left corner
2. A menu will appear at the top of the page. Enter the name of your branch
3. Click **Create new branch...**

![Create a new branch on GitHub's browser-based editor](/images/learn/dapps-list/directory-3.webp)

The page will reload, and your branch name will now be displayed in the bottom left corner.

### Projects with Deployments on Moonbeam and Moonriver {: #projects-with-deployments }

If a project is deployed to both Moonbeam and Moonriver, there are two different options available:

- Create a separate project structure for each deployment
- Use a single project structure and modify the project data file for both projects

Separate project structures should be used if:

- The two deployments have distinct representations in DefiLlama (i.e., two distinct identifiers)
- The project has two different tokens, one native to Moonbeam and one native to Moonriver

Otherwise, either option may be used.

### Set Up the Folder Structure for Your Project {: #set-up-the-file-structure }

All configurations for each project listed in the DApp Directory are stored in the `projects` folder.

To get started, you must have a name that uniquely and properly identifies your project. Using your project name, you can take the following steps:

1. Create a new directory for your project using your unique project name
2. In your project directory, you'll need to create:
    1. A project data file is a JSON file that defines all your project data and contains references to the images stored in the `logos` and `screenshots` folders. The list of fields you can use to define your data, with descriptions, is outlined in the next section. The file must be named using your unique project name
    2. A `logos` folder where your project logo images are stored
    3. (Optional) A `screenshots` folder where screenshots for the project are stored

??? code "Example folder structure"

    ```text
    --8<-- 'code/learn/dapps-list/folder-structure.md'
    ```

![The file structure displayed on GitHub's browser-based editor](/images/learn/dapps-list/directory-4.webp)

With the foundational file structure in place, you're ready to populate the necessary information for your project submission.

### Add Information to the Project Data File {: #add-information }

Your project's data file is where you'll add all the information for your project. The file permits the following top-level properties:

| <div style="width:10vw">Property</div> |                         Type                          |                                                                                                                                                                      Description                                                                                                                                                                       |
|:--------------------------------------:|:-----------------------------------------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|                  `id`                  |                        String                         |                                                                                               Unique identifier for the dApp in the Moonbeam DApp Directory. It should be a unique, human-readable string representing this project. E.g., `my-project`                                                                                                |
|                 `slug`                 |                        String                         |                                                  Identifier used in certain third-party sources. In particular, if the project is listed in DefiLlama, this value should be set to the DefiLlama identifier. See the [Configure the Data Source for TVL](#configure-tvl) section for more information                                                  |
|                 `name`                 |                        String                         |                                                                                                                                      The project name as it will appear in the DApp Directory. E.g., `My Project`                                                                                                                                      |
|               `category`               |                        String                         |                                         The category the project should be associated with. A project can only have one category, and it corresponds to the category list in the left-hand nav of the DApp Directory. See the [Category and Tags](#category-and-tags) section for the accepted list of values                                          |
|             `coinGeckoId`              |                        String                         |                                              If the project has a token listed on CoinGecko, this property should have the **API ID** value corresponding to the given token. See the [Configure the Data Source for Project Token Information](#project-token-information) section for more information                                               |
|                `chains`                |                   Array of Strings                    |                                                                                                               List of Moonbeam ecosystem chains on which the project is deployed. Valid values are currently `moonbeam` and `moonriver`                                                                                                                |
|              `web3goIDs`               |                   Array of Strings                    | List of Web3Go identifiers for a given dApp. The identifiers should correspond to the **Project** component of the smart contract labels set up in Moonscan. Generally, there should only be one value in the array. See the [Configure the Data Source for Active Users and Transaction Volume](#configure-active-users) section for more information |
|                 `logo`                 |            Map of Strings to JSON objects             |                                                                                                     Map of logo image files associated with this project and stored in the `logos` directory. See the [Logos](#logos) section for more information                                                                                                     |
|           `shortDescription`           |                        String                         |                                                                                                      A short description of the project used in the display card when browsing dapps in the directory. This should be kept to under 80 characters                                                                                                      |
|             `description`              |                        String                         |                                                                               A longer description used in the project detail page. Markdown or similar formatting cannot be used. Line breaks can be used using `\r\n`. The text should be limited to a few paragraphs                                                                                |
|                 `tags`                 |                   Array of Strings                    |                                                                       A list of applicable [tags](#category-and-tags) for this project. Tag values will show up in the project details. See the [Category and Tags](#category-and-tags) section for the accepted list of values                                                                        |
|              `contracts`               |            Array of contract JSON objects             |                                                     List of contracts for the project. Currently, this is used only for token contracts. The list of smart contracts which make up the protocol is externally sourced from Moonscan. See the [Contracts](#contracts) section for more information                                                      |
|                 `urls`                 |       Map of Strings (names) to Strings (URLs)        |                                                                                                        Mapping of URLs for websites and socials associated with the project. See the [URLs](#urls) section for the accepted list of properties                                                                                                         |
|             `screenshots`              | Array of Maps of Strings (size) to image JSON objects |                                                                                        List of screenshot image files associated with this project and stored in the `screenshots` directory. See the [Screenshots](#screenshots) section for more information                                                                                         |
|         `projectCreationDate`          |                          int                          |                                                                                                                                   The date the project was created. Used for sorting purposes in the DApp Directory                                                                                                                                    |

??? code "Example project data file"

    ```json
    --8<-- 'code/learn/dapps-list/project-data-file.json'
    ```

#### Category and Tags {: #category-and-tags }

A category is the primary classification for a project. A project can be categorized under only one category, but it can have multiple tags. Ensure you carefully select the most applicable category for your project to ensure it is easily found. Any secondary classifications can be included as a tag. 

The currently supported values for `category` are:

```text
--8<-- 'code/learn/dapps-list/categories.md'
```

The currently supported values for `tag` are:

```text
--8<-- 'code/learn/dapps-list/tags.md'
```

#### URLs {: #urls }

The `urls` property name/value pairs are used so a project can provide links to their website, socials, etc.

The following table lists the supported `urls` properties:

| Property Name |                                                    Description                                                     |                     Example                     |
|:-------------:|:------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------:|
|   `website`   |                                          The main website for the project                                          |            https://moonbeam.network/            |
|     `try`     | URL a user should visit if they want to try out the dApp. Typically, this page will have a link to launch the dApp |            https://moonbeam.network/            |
|   `twitter`   |                                           The project's Twitter profile                                            |       https://twitter.com/MoonbeamNetwork       |
|   `medium`    |                                             The project's Medium site                                              |       https://medium.com/moonbeam-network       |
|  `telegram`   |                                               The project's Telegram                                               |         https://t.me/Moonbeam_Official          |
|   `github`    |                                          The project's GitHub repository                                           | https://github.com/moonbeam-foundation/moonbeam |
|   `discord`   |                                               The project's Discord                                                |       https://discord.com/invite/PfpUATX        |

The format of the property name/value pairs should follow the JSON standard, for example:

```json
--8<-- 'code/learn/dapps-list/urls.json'
```

#### Logos {: #logos }

The `logos` property of the main project data file is a map of image sizes (i.e., `small`, `large`, `full`) to corresponding image JSON objects. The image JSON object contains the display properties for the given image.

The following table lists the properties of the image JSON object:

|  Property  |  Type  |                                                                       Description                                                                        |
|:----------:|:------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------:|
| `fileName` | String |                                         The name of the image file (unqualified) stored in the `logos` directory                                         |
|  `width`   |  int   |                                                          The width of the logo image in pixels                                                           |
|  `height`  |  int   |                                                          The height of the logo image in pixels                                                          |
| `mimeType` | String | The standard [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types){target=\_blank} of the file. E.g., `"image/jpeg"` |

Currently, only the `small` size is utilized, and the dimensions for small logos should be 40x40 pixels.

Here is an example showing the structure of the `logo` property that supplies `small` and `full` logos:

```json
--8<-- 'code/learn/dapps-list/logo.json'
```

#### Screenshots {: #screenshots }

The `screenshots` property of the main project data file is an array of maps. Each map in the array is for a specific screenshot.

However, different-sized images for each screenshot should be supplied so that different sizes can be used in different contexts (e.g., thumbnails vs full-sized images). Thus, for each screenshot, there is a map of image sizes (i.e., `small`, `large`, `full`) to corresponding image JSON objects. The image JSON object contains the display properties for the given image.

The following table lists the properties of the image JSON object:

|  Property  |  Type  |                                                                       Description                                                                        |
|:----------:|:------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------:|
| `fileName` | String |                                      The name of the image file (unqualified) stored in the `screenshots` directory                                      |
|  `width`   |  int   |                                                          The width of the logo image in pixels                                                           |
|  `height`  |  int   |                                                          The height of the logo image in pixels                                                          |
| `mimeType` | String | The standard [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types){target=\_blank} of the file. E.g., `"image/jpeg"` |

Here is an example showing the structure of the `screenshot` property for two screenshots (`screenshot1` and `screenshot2`):

```json
--8<-- 'code/learn/dapps-list/screenshots.json'
```

#### Contracts {: #contracts }

A list of contracts for the project. Currently, this is used only for token contracts.

The smart contracts that make up the protocol are sourced from [Moonscan](https://moonscan.io){target=\_blank} based on tagging, so they do not need to be listed here. If you have not properly labeled your contracts or are unsure if they are labeled according to the Moonbeam community standard, please refer to the [Configure the Data Source for Active Users and Transaction Volume](#configure-active-users) section.

The following table lists the properties found in the contract JSON object:

|  Property  |  Type  |                                  Description                                  |
|:----------:|:------:|:-----------------------------------------------------------------------------:|
| `contract` | String |                      The address for the smart contract                       |
|  `chain`   | String | The chain on which the contract is deployed (i.e., `moonbeam` or `moonriver`) |
|   `name`   | String |                           The name of the contract                            |

Here is a `contracts` array with a single smart contract for the WGLMR token:

```json
--8<-- 'code/learn/dapps-list/contracts.json'
```

### Submit a Pull Request {: #submit-a-pull-request }

After you've populated the project data file and added your logos and screenshots, you should be ready to submit your pull request.

![All of the project files added on GitHub's browser-based editor](/images/learn/dapps-list/directory-5.webp)

From the web-based editor, take the following steps to commit your changes to the `app-directory-data` repository:

1. Click on the **Source Control** tab, which should show you how many pages have been added or changed
2. Review the files under the **Changes** section. Click the **+** button next to **Changes**, or as you review each file, click the **+** button next to the file name to add them to the list of **Staged Changes**

![Staging the changed files on GitHub's browser-based editor](/images/learn/dapps-list/directory-6.webp)

All of your files should now be under the **Staged Changes** section. All you have to commit and push the changes are:

1. Enter a descriptive commit message, such as "Add My Project", making sure to use your actual project name
2. Click **Commit & Push**

![Committing the staged files on GitHub's browser-based editor](/images/learn/dapps-list/directory-7.webp)

Now that you've committed the changes, you'll need to head over to the [`app-directory-data` repository](https://github.com/moonbeam-foundation/app-directory-data){target=\_blank} and open a pull request against the `develop` branch:

1. At the top of the repository page, click **Compare and Pull** button displayed on the banner, or
2. If the banner is not there anymore, you'll need to select your branch from the branches dropdown
3. Click the **Contribute** dropdown
4. Click the **Open pull request** button

![The main page of the app-directory-data repository on GitHub](/images/learn/dapps-list/directory-8.webp)

You'll be taken to the **Comparing changes** page, where you'll need to:

1. Make sure that you are merging your branch into the `develop` branch, which is the **base** branch
2. Add a title
3. Add a description of the changes
4. Click **Create pull request**

![Submit a pull request on the Comparing changes page of the app-directory-data repository on GitHub](/images/learn/dapps-list/directory-9.webp)

### The Review Process {: #review-process }

Submitted pull requests will be reviewed bi-weekly by the Moonbeam Foundation. During the review, and especially for new projects, the Foundation may have to verify that the GitHub user who created the pull request is a contributor and/or represents the specific project. One way projects can expedite this process is if the submitter's GitHub account is also a major contributor to the project itself on GitHub. Alternatively, teams should leave a note in the pull request comments indicating how we can get in touch with project team members to verify.

A comment will be added to the pull request if any changes are requested. After your pull request has been approved, it will be merged, and your project will be added to the Moonbeam DApp Directory!

## How to Update Your Project Listing {: #how-to-update-your-project-listing }

As your project evolves, you may need to update your project's listing or images related to your listing. You can create a new branch for your changes, find and modify your existing project's data from the root `projects` directory, and make the desired changes.

If you are no longer using a logo or screenshot, please remember to remove it from the `logos` or `screenshots` directory.

Once your changes have been made, you must follow the same instructions in the [Submit a Pull Request](#submit-a-pull-request) section so the changes can be [reviewed](#review-process) by the Moonbeam Foundation. Please note that pull requests are reviewed on a bi-weekly basis, so if the update is urgent, you can create a [forum post](https://forum.moonbeam.network){target=\_blank} asking for assistance.

## DApp Directory API {: #dapp-directory-api }

The DApp Directory also features a queryable API that you can use to integrate data from Moonbeam's DApp Directory into your application. The API is public and currently does not require authentication. The base URL for the API is as follows:

```bash
https://apps.moonbeam.network/api/ds/v1/app-dir/
```

### Query a Project {: #query-a-project}

You can retrieve all the information for a particular project by appending `/projects/INSERT_PROJECT_NAME` to the base URL. If you need clarification on the project name, you can omit the project name as shown below to retrieve data for every listed project and find the project in the response. 

```bash
https://apps.moonbeam.network/api/ds/v1/app-dir/projects
```

Here's an example of querying the API for StellaSwap, which returns the project description, social media information, user counts, relevant smart contract addresses, market data, images, and more. 

```bash
https://apps.moonbeam.network/api/ds/v1/app-dir/projects/stellaswap
```

You can visit the query URL directory in the browser, using a tool like Postman, or directly from the command line with Curl as follows: 

```bash
curl -H "Content-Type: application/json" -X GET 'https://apps.moonbeam.network/api/ds/v1/app-dir/projects/stellaswap'
```

??? code "API Response to Querying StellaSwap"

    ```json
    --8<-- 'code/learn/dapps-list/stellaswap.json'
    ```

### Query a Category {: #query-a-category}

You can also query the API by [category](#category-and-tags). For example, you can retrieve information about all NFT projects with the following query:

```bash
https://apps.moonbeam.network/api/ds/v1/app-dir/projects?category=nfts
```

??? code "API Response to Querying NFT projects"

    ```json
    --8<-- 'code/learn/dapps-list/nfts.json'
    ```

Below are all possible categories and their respective parameters for querying the API. Ensure you query the API with the parameter formatted exactly as shown in lowercase.

| Category | API Parameter |
|:--------:|:-------------:|
| Bridges  |   `bridges`   |
|   DAO    |     `dao`     |
|   DEX    |     `dex`     |
|   DeFi   |    `defi`     |
|  Gaming  |   `gaming`    |
| Lending  |   `lending`   |
|   NFTs   |    `nfts`     |
|  Other   |    `other`    |
|  Social  |   `social`    |
| Wallets  |   `wallets`   |


### Query a Chain {: #query-a-chain}

The following queries can be used to query all of the listed projects on Moonbeam or Moonriver. Note that Moonbase Alpha is not a supported network in the DApp Directory.

=== "Moonbeam"

    ```bash
    https://apps.moonbeam.network/api/ds/v1/app-dir/projects?chain=moonbeam
    ```

=== "Moonriver"

    ```bash
    https://apps.moonbeam.network/api/ds/v1/app-dir/projects?chain=moonriver
    ```

<div class="page-disclaimer">
    --8<-- 'text/_disclaimers/user-generated-content.md'
</div>
