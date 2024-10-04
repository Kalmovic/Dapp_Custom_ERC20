# Crypto Challenge

Crypto Challenge is a decentralized application (dApp) that allows users to view their Bitso Token (BIT) balance and transfer tokens securely on the Ethereum blockchain. The app is built with React, TypeScript, and Vite, and integrates with Ethereum wallets using ConnectKit and Wagmi. It features a responsive design, real-time token balance updates, gas fee estimation, and toast notifications for transaction statuses.

## Media

https://github.com/user-attachments/assets/dc6d1996-864a-4867-849d-8bab4a1d9cde

## Features

- **Wallet Integration**: Connect your wallet using MetaMask or other compatible wallets.
- **Real-Time Token Balance**: View your current token balance with real-time updates.
- **Secure Token Transfers**: Transfer tokens effortlessly with a multi-step form that ensures accuracy and security.
- **Animated UI/UX**: Enjoy smooth transitions and interactive animations powered by Framer Motion.
- **Responsive Design**: Optimized for desktop and mobile devices, ensuring a consistent platform experience.
- **Form Validation**: Robust form validation using React Hook Form and Yup to prevent errors.
- **Gas Fee Estimation**: Get real-time gas fee estimates before confirming transactions.
- **Notifications**: Receive instant feedback on transaction statuses with toast notifications.

## Technologies Used

- **React**: Frontend library for building user interfaces.
- **TypeScript**: Typed superset of JavaScript for enhanced developer experience.
- **Vite**: Fast and modern frontend build tool.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Framer Motion**: Animation library for React to create smooth transitions.
- **React Router v6**: Declarative routing for React applications.
- **ConnectKit**: Library for connecting to Ethereum wallets.
- **Wagmi**: React Hooks library for Ethereum.
- **Ethers.js**: Library for interacting with the Ethereum blockchain.
- **React Hook Form**: Performant, flexible form library for React.
- **Yup**: JavaScript schema builder for value parsing and validation.
- **Sonner**: Notification library for React.
- **Lucide React**: Icon library for React.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Kalmovic/Dapp_Custom_ERC20.git
   cd Dapp_Custom_ERC20
   ```

2. **Install Dependencies**

   ```bash
    npm install
   ```

3. **Create Environment Variables**

   Create a `.env` file in the root directory and add the following environment variables:

   ```env
   VITE_APP_ETHEREUM_NETWORK=sepolia
   VITE_APP_BITSO_TOKEN_ADDRESS=your_token_address_here
   ```

4. **Start the Development Server**

   ```bash
    npm run dev
   ```

## Usage

1. **Connect Your Wallet**

   Click on the "Connect Wallet" button to connect your MetaMask or other compatible wallet.

2. **View Token Balance**

   After connecting, your current balance of Bitso Tokens (BIT) will be displayed on the dashboard.

3. **Transfer Tokens**

- Click on the "Transfer" button.
- The button will morph into a transfer form.
- Step 1: Enter the recipient's Ethereum address and the amount of BIT you wish to transfer.
- Step 2: Review the transfer details and the estimated gas fee.
- Step 3: Confirm the transaction. The app will display a loading spinner while processing and notify you upon success or failure.

4. **Disconnect Your Wallet**

   Click on the Wallet button to disconnect your wallet.

## Token Address (Sepolia Testnet)

You can use the following Bitso Token (BIT) address for testing purposes on the Sepolia testnet:

https://sepolia.etherscan.io/token/0x02fBb95A90f2Ba4F0CFb4B9828f3379cd868295A

