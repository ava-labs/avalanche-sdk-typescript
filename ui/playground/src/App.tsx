/**
 * Avalanche SDK UI Playground
 * 
 * To create a new Avalanche application, run:
 *   npm create avalanche
 * 
 * Or visit: https://github.com/ava-labs/avalanche-sdk-typescript
 */

import React, { useMemo, useState, useEffect } from 'react';
import { 
  AvalancheProvider, 
  CrossChainTransfer, 
  WalletProvider, 
  WalletBalance, 
  WalletConnect,
  WalletDropdown,
  WalletMessage,
  WalletPortfolio,
  WalletTransactions,
  WalletActivity,
  NetworkSelector,
  useAvalanche,
  Button, 
  Badge, 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  Input, 
  ThemeProvider, 
  AvalancheLogo, 
  ChainLogo,
  ChainRow,
  ChainSelectDropdown,
  TokenChip,
  TokenImage,
  TokenRow,
  TokenSelectDropdown,
  AddressInput,
  AmountInput,
  Earn,
  ICTT,
  Stake,
  type ChainOption,
  type Token
} from '@avalanche-sdk/ui';
import { avalanche, avalancheFuji } from '@avalanche-sdk/client/chains';
import { dispatch, echo } from './chains';
import type { ICTTToken } from '@avalanche-sdk/ui';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { InstallCommand } from './components/InstallCommand';
import { ComponentWithCode } from './components/ComponentWithCode';
import { ChainBalancesSectionContent } from './components/ChainBalancesSection';
import { SingleChainTransferDemo } from './components/SingleChainTransferDemo';
import { SimpleTransfer } from './components/SimpleTransfer';
import { SimpleICTT1 } from './components/SimpleICTT1';
import { SimpleICTT2 } from './components/SimpleICTT2';
import { ChainListDemo } from './components/ChainListDemo';
import { EarnDemo1 } from './components/EarnDemo1';
import { EarnDemo2 } from './components/EarnDemo2';
import { NavigationSidebar } from './components/NavigationSidebar';
import { Footer } from './components/Footer';
import './App.css';

function App() {
  // Set favicon
  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) {
      link.href = '/favicon.ico';
      link.type = 'image/x-icon';
    } else {
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.type = 'image/x-icon';
      newLink.href = '/favicon.ico';
      document.getElementsByTagName('head')[0].appendChild(newLink);
    }
  }, []);

  // User provides their own chain list - including custom Avalanche subnets
  const availableChains = [
    Object.assign(avalanche, { 
      iconUrl: "https://raw.githubusercontent.com/ava-labs/avalanche-starter-kit/refs/heads/main/web-apps/public/chains/logo/43113.png",
      testnet: false
    }),
    Object.assign(avalancheFuji, { 
      blockchainId: '0x7fc93d85c6d62c5b2ac0b519c87010ea5294012d1e407030d6acd0021cac10d5',
      iconUrl: "https://raw.githubusercontent.com/ava-labs/avalanche-starter-kit/refs/heads/main/web-apps/public/chains/logo/43113.png",
      testnet: true,
      interchainContracts: {
        teleporterRegistry: '0xF86Cb19Ad8405AEFa7d09C778215D2Cb6eBfB228',
        teleporterManager: '0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf',
      }
    }),
    dispatch,
    echo,
  ];

  const chainShowcaseOptions = useMemo<ChainOption[]>(() => {
    return availableChains.map((chain) => ({
      id: chain.id.toString(),
      name: chain.name,
      description: chain.testnet ? 'Testnet network' : 'Mainnet network',
      iconUrl: (chain as any)?.iconUrl,
      badge: chain.testnet ? 'T' : undefined,
      testnet: chain.testnet ?? false,
      icon: (
        <ChainLogo
          chain={chain}
          size={32}
          badge={chain.testnet ? 'T' : undefined}
          showLabel={!('iconUrl' in chain && chain.iconUrl)}
        />
      ),
    }));
  }, [availableChains]);

  const [selectedChainId, setSelectedChainId] = useState<string>(() => chainShowcaseOptions[0]?.id?.toString() ?? '');

  // User provides well-known tokens for ICTT
  const wellKnownTokens: ICTTToken[] = [
    {
      address: '0xa216e8ff9d8ac1bc4c37daab5fbe89b7d9b7514e',
      name: 'Mock Token',
      symbol: 'EXMP',
      decimals: 18,
      chainId: '173750',
      ictt: {
        home: '0x1a7c48cf8382c4d066addc7b825ceec3a454a7ac',
        mirrors: [
          { chainId: '779672', address: '0xa4637506d64d806529fbedcea160f371cde07311' },
        ]
      }
    }
  ];

  const [activeToken, setActiveToken] = useState<Token | undefined>(() => wellKnownTokens[0]);
  
  // Form state for Form Elements demo
  const [addressValue, setAddressValue] = useState('');
  const [amountValue, setAmountValue] = useState('');

  return (
    <ThemeProvider defaultTheme="avalanche" defaultMode="light">
      <AvalancheProvider 
        chain={avalancheFuji}
        chains={availableChains}
        wellKnownTokens={wellKnownTokens}
        config={{
          name: 'Multi-Theme UI Playground',
        }}
      >
      <WalletProvider
        onConnect={(address) => {
          console.log('Wallet connected:', address);
        }}
        onError={(error) => {
          console.error('Wallet error:', error);
        }}
      >
        <div className="playground">
          <NavigationSidebar />
            <div className="lg:ml-96 lg:pl-8 lg:pr-8">
              {/* Header */}
            <header className="playground-header">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                    <AvalancheLogo size={48} className="text-primary" />
                  <div>
                      <h1 className="text-4xl font-bold text-foreground tracking-tight">
                        UI Playground
                      </h1>
                      <p className="text-muted-foreground mt-1 text-lg">
                        Explore Avalanche SDK components and themes
                      </p>
                  </div>
                </div>
                <ThemeSwitcher />
              </div>
            </header>

            <main className="playground-main">
                {/* Install Command Section */}
                <section id="install-command" className="component-section">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-foreground mb-2">
                      Get Started
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      Create a new Avalanche application with the SDK
                    </p>
                </div>
                  <InstallCommand />
              </section>

                {/* Theme Showcase Section */}
                <section id="theme-showcase" className="component-section">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-foreground mb-2">Design System</h2>
                    <p className="text-muted-foreground text-lg">
                      Core UI components with theme-aware styling
                    </p>
                </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                    {/* Button Variants */}
                    <ComponentWithCode
                      title="Button Variants"
                      description="Theme-aware button styles"
                      badge={<Badge variant="default" className="text-xs">New</Badge>}
                      code={`import { Button } from '@avalanche-sdk/ui';

<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button disabled>Disabled</Button>`}
                      language="tsx"
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Badge variant="default" className="text-xs">New</Badge>
                            Button Variants
                          </CardTitle>
                          <CardDescription>Theme-aware button styles</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Button variant="default" className="w-full">Primary</Button>
                          <Button variant="secondary" className="w-full">Secondary</Button>
                          <Button variant="outline" className="w-full">Outline</Button>
                          <Button variant="ghost" className="w-full">Ghost</Button>
                          <Button variant="link" className="w-full">Link</Button>
                        </CardContent>
                      </Card>
                    </ComponentWithCode>

                    {/* Badge Variants */}
                    <ComponentWithCode
                      title="Badge Variants"
                      description="Status and category indicators"
                      code={`import { AvalancheProvider, Badge } from '@avalanche-sdk/ui';
import { avalanche, avalancheFuji } from '@avalanche-sdk/client/chains';

function App() {
  const availableChains = [avalanche, avalancheFuji];
  
  return (
    <AvalancheProvider availableChains={availableChains}>
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
    </AvalancheProvider>
  );
}`}
                      language="tsx"
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>Badge Variants</CardTitle>
                          <CardDescription>Status and category indicators</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="default">Default</Badge>
                            <Badge variant="secondary">Secondary</Badge>
                            <Badge variant="destructive">Destructive</Badge>
                            <Badge variant="outline">Outline</Badge>
                            <Badge variant="success">Success</Badge>
                            <Badge variant="warning">Warning</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </ComponentWithCode>

                    {/* Form Elements */}
                    <ComponentWithCode
                      title="Form Elements"
                      description="Inputs and form controls"
                      code={`import { AvalancheProvider, AddressInput, AmountInput, Button } from '@avalanche-sdk/ui';
import { avalanche, avalancheFuji } from '@avalanche-sdk/client/chains';
import { useState } from 'react';

function MyForm() {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const availableChains = [avalanche, avalancheFuji];

  return (
    <AvalancheProvider availableChains={availableChains}>
      <div className="space-y-4">
        <AddressInput
          label="Recipient Address"
          chainType="C"
          value={address}
          onChange={(value, validation) => {
            setAddress(value);
            console.log('Validation:', validation);
          }}
          showValidation={true}
        />
        <AmountInput
          label="Amount"
          symbol="AVAX"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          showMax={true}
          showUSD={false}
        />
        <Button 
          variant="default" 
          disabled={!address || !amount}
        >
          Submit
        </Button>
      </div>
    </AvalancheProvider>
  );
}`}
                      language="tsx"
                      className="md:col-span-2 lg:col-span-3"
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>Form Elements</CardTitle>
                          <CardDescription>Inputs and form controls</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <AddressInput
                            label="Recipient Address"
                            chainType="C"
                            value={addressValue}
                            onChange={(value, validation) => {
                              setAddressValue(value);
                              console.log('Address validation:', validation);
                            }}
                            showValidation={true}
                          />
                          <AmountInput
                            label="Amount"
                            symbol="AVAX"
                            value={amountValue}
                            onChange={(e) => setAmountValue(e.target.value)}
                            showMax={true}
                            showUSD={false}
                            placeholder="0.0"
                          />
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="w-full"
                            disabled={!addressValue || !amountValue}
                          >
                            Submit Transaction
                          </Button>
                        </CardContent>
                      </Card>
                    </ComponentWithCode>

                    {/* Chain Components */}
                    <ComponentWithCode
                      title="Chain Components"
                      description="Avalanche chain identification and selection"
                      badge={<Badge variant="default" className="text-xs">New</Badge>}
                      code={`import { AvalancheProvider, ChainLogo, ChainRow, ChainSelectDropdown } from '@avalanche-sdk/ui';
import { avalanche, avalancheFuji } from '@avalanche-sdk/client/chains';

function App() {
  const availableChains = [avalanche, avalancheFuji];
  
  return (
    <AvalancheProvider availableChains={availableChains}>
      {/* Chain Logo */}
      <ChainLogo chain={avalancheFuji} size={48} badge="P" />

      {/* Chain Row */}
      <ChainRow chain={{
        id: '43113',
        name: 'Avalanche Fuji',
        iconUrl: 'https://...'
      }} />

      {/* Chain Select Dropdown */}
      <ChainSelectDropdown
        options={chainOptions}
        value={selectedChainId}
        onValueChange={(value, chain) => {
          console.log('Selected:', chain);
        }}
      />
    </AvalancheProvider>
  );
}`}
                      language="tsx"
                      className="md:col-span-2 lg:col-span-1"
                    >
                      <Card className="md:col-span-2 lg:col-span-1">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Badge variant="default" className="text-xs">New</Badge>
                            Chain Components
                          </CardTitle>
                          <CardDescription>Avalanche chain identification and selection</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Chain Logo */}
                          <div>
                            <p className="text-sm font-medium text-foreground mb-4">
                              Chain Logo
                            </p>
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <ChainLogo chain={avalancheFuji} size={48} badge="P" />
                                <div>
                                  <p className="font-semibold text-sm">With Badge</p>
                                  <p className="text-xs text-muted-foreground">
                                    P-Chain logo with badge overlay
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <ChainLogo chain={echo} size={48} />
                                <div>
                                  <p className="font-semibold text-sm">Without Badge</p>
                                  <p className="text-xs text-muted-foreground">
                                    Clean logo without overlay
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="h-px bg-border -mx-6" />

                          {/* Chain Row */}
                          <div>
                            <p className="text-sm font-medium text-foreground mb-4">
                              Chain Row
                            </p>
                            <div className="space-y-3 border rounded-md p-3">
                              {chainShowcaseOptions.slice(0, 3).map((chainOption) => (
                                <ChainRow 
                                  key={chainOption.id}
                                  chain={chainOption}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="h-px bg-border -mx-6" />

                          {/* Chain Select Dropdown */}
                          <div>
                            <p className="text-sm font-medium text-foreground mb-4">
                              Chain Select Dropdown
                            </p>
                            <ChainSelectDropdown
                              options={chainShowcaseOptions}
                              value={selectedChainId}
                              onValueChange={(value, chain) => {
                                setSelectedChainId(value);
                                console.log('Selected chain:', chain);
                              }}
                              placeholder="Select a chain"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </ComponentWithCode>

                    {/* Token Components */}
                    <ComponentWithCode
                      title="Token Components"
                      description="Token display and selection"
                      badge={<Badge variant="default" className="text-xs">New</Badge>}
                      code={`import { AvalancheProvider, TokenImage, TokenChip, TokenRow } from '@avalanche-sdk/ui';
import type { Token } from '@avalanche-sdk/ui';
import { avalanche, avalancheFuji } from '@avalanche-sdk/client/chains';

function App() {
  const availableChains = [avalanche, avalancheFuji];
  
  const token: Token = {
    address: '0x...',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 18,
    chainId: 43114,
  };

  return (
    <AvalancheProvider availableChains={availableChains}>
      {/* Token Image */}
      <TokenImage token={token} size={32} />

      {/* Token Chip */}
      <TokenChip 
        token={token}
        onClick={(t) => console.log('Selected:', t)}
      />

      {/* Token Row */}
      <TokenRow
        token={token}
        amount="1234.56"
        onClick={(t) => console.log('Clicked:', t)}
      />
    </AvalancheProvider>
  );
}`}
                      language="tsx"
                      className="md:col-span-2 lg:col-span-1"
                    >
                      <Card className="md:col-span-2 lg:col-span-1">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Badge variant="default" className="text-xs">New</Badge>
                            Token Components
                          </CardTitle>
                          <CardDescription>Token display and selection</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <p className="text-sm font-medium text-foreground mb-4">
                              Token Images
                            </p>
                            <div className="flex items-center gap-3">
                              {wellKnownTokens.map((token, idx) => (
                                <TokenImage key={idx} token={token} size={32} />
                              ))}
                              {wellKnownTokens[0] && (
                                <TokenImage 
                                  token={{ ...wellKnownTokens[0], image: null }} 
                                  size={32} 
                                />
                              )}
                            </div>
                          </div>

                          <div className="h-px bg-border -mx-6" />

                          <div>
                            <p className="text-sm font-medium text-foreground mb-4">
                              Token Chips
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {wellKnownTokens.map((token, idx) => (
                                <TokenChip 
                                  key={idx}
                                  token={token}
                                  onClick={(token) => console.log('Selected:', token.symbol)}
                                />
                              ))}
                              {wellKnownTokens[0] && (
                                <TokenChip 
                                  token={wellKnownTokens[0]}
                                  isPressable={false}
                                />
                              )}
                            </div>
                          </div>

                          <div className="h-px bg-border -mx-6" />

                          <div>
                            <p className="text-sm font-medium text-foreground mb-4">
                              Token Rows
                            </p>
                            <div className="flex flex-col gap-2 border rounded-md p-2">
                              {wellKnownTokens.map((token, idx) => (
                                <TokenRow
                                  key={idx}
                                  token={token}
                                  amount="1234.56"
                                  onClick={(t) => console.log('Clicked:', t.symbol)}
                                />
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </ComponentWithCode>
                </div>
              </section>

                {/* Wallet Components */}
                <section id="wallet-components" className="component-section">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-foreground mb-2">
                      Wallet Integration
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      Connect and manage wallet connections
                    </p>
                </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Wallet Connect */}
                    <ComponentWithCode
                      title="Wallet Connect"
                      description="Connect your wallet to interact with Avalanche"
                      code={`import { AvalancheProvider, WalletProvider, WalletConnect } from '@avalanche-sdk/ui';
import { avalanche, avalancheFuji } from '@avalanche-sdk/client/chains';

function App() {
  const availableChains = [avalanche, avalancheFuji];
  
  return (
    <AvalancheProvider availableChains={availableChains}>
      <WalletProvider>
        <WalletConnect />
      </WalletProvider>
    </AvalancheProvider>
  );
}`}
                      language="tsx"
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>Wallet Connect</CardTitle>
                          <CardDescription>
                            Connect your wallet to interact with Avalanche
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <WalletConnect />
                        </CardContent>
                      </Card>
                    </ComponentWithCode>

                    {/* Wallet Dropdown - With XP Addresses */}
                    <ComponentWithCode
                      title="Wallet Dropdown"
                      description="View wallet address with X-Chain and P-Chain addresses"
                      badge={<Badge variant="outline" className="text-xs">showXPAddresses</Badge>}
                      code={`import { AvalancheProvider, WalletProvider, WalletDropdown } from '@avalanche-sdk/ui';
import { avalanche, avalancheFuji } from '@avalanche-sdk/client/chains';

function App() {
  const availableChains = [avalanche, avalancheFuji];
  
  return (
    <AvalancheProvider availableChains={availableChains}>
      <WalletProvider>
        {/* With X-Chain and P-Chain addresses */}
        <WalletDropdown showXPAddresses />

        {/* C-Chain only (default) */}
        <WalletDropdown />
      </WalletProvider>
    </AvalancheProvider>
  );
}`}
                      language="tsx"
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            Wallet Dropdown
                            <Badge variant="outline" className="text-xs">showXPAddresses</Badge>
                          </CardTitle>
                          <CardDescription>
                            View wallet address with X-Chain and P-Chain addresses
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <WalletDropdown showXPAddresses />
                        </CardContent>
                      </Card>
                    </ComponentWithCode>

                    {/* Wallet Dropdown - Without XP Addresses */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          Wallet Dropdown
                          <Badge variant="outline" className="text-xs">default</Badge>
                        </CardTitle>
                        <CardDescription>
                          View wallet address (C-Chain only)
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <WalletDropdown />
                      </CardContent>
                    </Card>

                    {/* Wallet Message */}
                    <ComponentWithCode
                      title="Wallet Message"
                      description="Display wallet connection status messages"
                      code={`import { AvalancheProvider, WalletProvider, WalletMessage, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@avalanche-sdk/ui';
import { avalanche, avalancheFuji } from '@avalanche-sdk/client/chains';

function App() {
  const availableChains = [avalanche, avalancheFuji];
  
  return (
    <AvalancheProvider availableChains={availableChains}>
      <WalletProvider>
        <Card>
          <CardHeader>
            <CardTitle>Wallet Message</CardTitle>
            <CardDescription>
              Display wallet connection status messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WalletMessage />
          </CardContent>
        </Card>
      </WalletProvider>
    </AvalancheProvider>
  );
}`}
                      language="tsx"
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>Wallet Message</CardTitle>
                          <CardDescription>
                            Display wallet connection status messages
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <WalletMessage />
                        </CardContent>
                      </Card>
                    </ComponentWithCode>

                    {/* Network Selector */}
                    <ComponentWithCode
                      title="Network Selector"
                      description="Switch between available networks"
                      code={`import { AvalancheProvider, WalletProvider, NetworkSelector, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@avalanche-sdk/ui';
import { avalanche, avalancheFuji } from '@avalanche-sdk/client/chains';

function App() {
  const availableChains = [avalanche, avalancheFuji];
  
  return (
    <AvalancheProvider availableChains={availableChains}>
      <WalletProvider>
        <Card>
          <CardHeader>
            <CardTitle>Network Selector</CardTitle>
            <CardDescription>
              Switch between available networks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NetworkSelector />
          </CardContent>
        </Card>
      </WalletProvider>
    </AvalancheProvider>
  );
}`}
                      language="tsx"
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>Network Selector</CardTitle>
                          <CardDescription>
                            Switch between available networks
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <NetworkSelector />
                        </CardContent>
                      </Card>
                    </ComponentWithCode>

                    {/* Wallet Balance - C-Chain */}
                    <ComponentWithCode
                      title="Wallet Balance"
                      description="C-Chain balance display"
                      code={`import { AvalancheProvider, WalletProvider, WalletBalance } from '@avalanche-sdk/ui';
import { avalanche, avalancheFuji } from '@avalanche-sdk/client/chains';

function App() {
  const availableChains = [avalanche, avalancheFuji];
  
  return (
    <AvalancheProvider availableChains={availableChains}>
      <WalletProvider>
        {/* C-Chain balance */}
        <WalletBalance chainType="cChain" />

        {/* P-Chain balance */}
        <WalletBalance chainType="pChain" />

        {/* X-Chain balance */}
        <WalletBalance chainType="xChain" />

        {/* With USD value */}
        <WalletBalance chainType="cChain" showUSD />
      </WalletProvider>
    </AvalancheProvider>
  );
}`}
                      language="tsx"
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>Wallet Balance</CardTitle>
                          <CardDescription>
                            C-Chain balance display
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <WalletBalance chainType="cChain" />
                        </CardContent>
                      </Card>
                    </ComponentWithCode>

                    {/* Wallet Portfolio */}
                    <ComponentWithCode
                      title="Wallet Portfolio"
                      description="View ERC-20 token balances for your connected wallet"
                      badge={<Badge variant="default" className="text-xs">Glacier</Badge>}
                      code={`import { AvalancheProvider, WalletProvider, WalletPortfolio } from '@avalanche-sdk/ui';
import { avalanche, avalancheFuji } from '@avalanche-sdk/client/chains';

function App() {
  const availableChains = [avalanche, avalancheFuji];
  
  return (
    <AvalancheProvider availableChains={availableChains}>
      <WalletProvider>
        <WalletPortfolio 
          showUSD 
          showRefresh 
        />
      </WalletProvider>
    </AvalancheProvider>
  );
}`}
                      language="tsx"
                      className="md:col-span-2"
                    >
                      <Card className="md:col-span-2">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            Wallet Portfolio
                            <Badge variant="default" className="text-xs">Glacier</Badge>
                          </CardTitle>
                          <CardDescription>
                            View ERC-20 token balances for your connected wallet
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <WalletPortfolio showUSD showRefresh />
                        </CardContent>
                      </Card>
                    </ComponentWithCode>

                    {/* Wallet Transactions */}
                    <ComponentWithCode
                      title="Wallet Transactions"
                      description="View transaction history with input/output tokens"
                      badge={<Badge variant="default" className="text-xs">Glacier</Badge>}
                      code={`import { AvalancheProvider, WalletProvider, WalletTransactions, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@avalanche-sdk/ui';
import { avalanche, avalancheFuji } from '@avalanche-sdk/client/chains';

function App() {
  const availableChains = [avalanche, avalancheFuji];
  
  return (
    <AvalancheProvider availableChains={availableChains}>
      <WalletProvider>
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              View transaction history with input/output tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WalletTransactions showRefresh />
          </CardContent>
        </Card>
      </WalletProvider>
    </AvalancheProvider>
  );
}`}
                      language="tsx"
                    >
                      <Card className="md:col-span-2">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            Transaction History
                            <Badge variant="default" className="text-xs">Glacier</Badge>
                          </CardTitle>
                          <CardDescription>
                            View transaction history with input/output tokens
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <WalletTransactions showRefresh />
                        </CardContent>
                      </Card>
                    </ComponentWithCode>

                    {/* Wallet Activity - Combined Portfolio & Transactions */}
                    <ComponentWithCode
                      title="Wallet Activity"
                      description="Combined view with tabs for token balances and transaction history"
                      badge={<Badge variant="default" className="text-xs">Glacier</Badge>}
                      code={`import { AvalancheProvider, WalletProvider, WalletActivity, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@avalanche-sdk/ui';
import { avalanche, avalancheFuji } from '@avalanche-sdk/client/chains';

function App() {
  const availableChains = [avalanche, avalancheFuji];
  
  return (
    <AvalancheProvider availableChains={availableChains}>
      <WalletProvider>
        <Card>
          <CardHeader>
            <CardTitle>Wallet Activity</CardTitle>
            <CardDescription>
              Combined view with tabs for token balances and transaction history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WalletActivity
              portfolioProps={{ showUSD: true }}
              transactionsProps={{}}
              defaultTab="portfolio"
              showRefresh={true}
              itemsPerPage={5}
            />
          </CardContent>
        </Card>
      </WalletProvider>
    </AvalancheProvider>
  );
}`}
                      language="tsx"
                    >
                      <Card className="md:col-span-1">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            Wallet Activity
                            <Badge variant="default" className="text-xs">Glacier</Badge>
                          </CardTitle>
                          <CardDescription>
                            Combined view with tabs for token balances and transaction history
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <WalletActivity
                            portfolioProps={{ showUSD: true }}
                            transactionsProps={{}}
                            defaultTab="portfolio"
                            showRefresh={true}
                            itemsPerPage={5}
                          />
                        </CardContent>
                      </Card>
                    </ComponentWithCode>
                </div>
              </section>

              {/* Balance Components */}
                <ChainBalancesSectionContent />

                {/* Provider Configuration */}
                <section id="provider-config" className="component-section">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-foreground mb-2">
                      Provider Configuration
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      Configure chain providers and network settings
                    </p>
                </div>
                  <ComponentWithCode
                    title="Chain List Demo"
                    description="Display available chains from AvalancheProvider"
                    code={`import React from 'react';
import { AvalancheProvider, useAvalanche, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@avalanche-sdk/ui';
import { avalanche, avalancheFuji } from '@avalanche-sdk/client/chains';

function ChainListDemo() {
  const { availableChains, chain: currentChain } = useAvalanche();

  return (
    <Card>
      <CardHeader className="pb-6">
        <div className="space-y-1.5">
          <CardTitle>Available Chains</CardTitle>
          <CardDescription>
            Chains available from AvalancheProvider when constructed
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Current Chain:</h4>
            <Badge variant="default" className="text-sm">
              {currentChain.name} (ID: {currentChain.id})
            </Badge>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">All Available Chains:</h4>
            <div className="flex flex-wrap gap-2">
              {availableChains.map((chain) => (
                <Badge 
                  key={chain.id} 
                  variant={chain.id === currentChain.id ? "default" : "secondary"}
                  className="text-sm"
                >
                  {chain.name} (ID: {chain.id})
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function App() {
  const availableChains = [avalanche, avalancheFuji];
  
  return (
    <AvalancheProvider availableChains={availableChains}>
      <ChainListDemo />
    </AvalancheProvider>
  );
}`}
                    language="tsx"
                  >
                    <ChainListDemo />
                  </ComponentWithCode>
              </section>

                {/* Transfer Components */}
                <section id="transfer-components" className="component-section">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-foreground mb-2">
                      Transfer Components
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      Transfer AVAX and tokens across chains
                    </p>
                </div>
                  <div className="space-y-6">
                <ComponentWithCode
                  title="Cross-Chain Transfer"
                  description="Move AVAX between C-Chain, P-Chain, and X-Chain"
                  code={`import { AvalancheProvider, WalletProvider, CrossChainTransfer } from '@avalanche-sdk/ui';
import { avalanche, avalancheFuji } from '@avalanche-sdk/client/chains';

function App() {
  const availableChains = [avalanche, avalancheFuji];
  
  return (
    <AvalancheProvider availableChains={availableChains}>
      <WalletProvider>
        <CrossChainTransfer
          title="Cross-Chain Transfer"
          initialFromChain="P"
          initialToChain="C"
          onSuccess={(result) => {
            console.log('Cross-chain transfer successful:', result);
          }}
          onError={(error) => {
            console.error('Cross-chain transfer error:', error);
          }}
        />
      </WalletProvider>
    </AvalancheProvider>
  );
}`}
                  language="tsx"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Cross-Chain Transfer</CardTitle>
                      <CardDescription>
                        Move AVAX between C-Chain, P-Chain, and X-Chain
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CrossChainTransfer
                        title="Cross-Chain Transfer"
                        initialFromChain="P"
                        initialToChain="C"
                        onSuccess={(result) => {
                          console.log('Cross-chain transfer successful:', result);
                        }}
                        onError={(error) => {
                          console.error('Cross-chain transfer error:', error);
                        }}
                      />
                    </CardContent>
                  </Card>
                </ComponentWithCode>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                      <ComponentWithCode
                        title="Single Chain Transfer Demo"
                        description="Send AVAX to another address on the same chain"
                        code={`import React, { useState } from 'react';
import { AvalancheProvider, WalletProvider, Transfer, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, ChainLogo } from '@avalanche-sdk/ui';
import { avalanche, avalancheFuji } from '@avalanche-sdk/client/chains';

function SingleChainTransferDemo() {
  const [selectedChain, setSelectedChain] = useState<'C' | 'P' | 'X'>('C');

  const chains = [
    { id: 'C' as const, name: 'C-Chain', description: 'Contract Chain' },
    { id: 'P' as const, name: 'P-Chain', description: 'Platform Chain' },
    { id: 'X' as const, name: 'X-Chain', description: 'Exchange Chain' },
  ];

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="space-y-1.5">
          <CardTitle>Single Chain Transfer</CardTitle>
          <CardDescription>Send AVAX to another address on the same chain</CardDescription>
        </div>
        
        <div className="flex gap-2 py-4 bg-muted/30 rounded-lg w-full justify-start">
          {chains.map((chain) => (
            <Button
              key={chain.id}
              variant={selectedChain === chain.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedChain(chain.id)}
              className="flex items-center gap-3 p-4"
            >
              <ChainLogo chain={chain.id} size={24} showLabel={true} />
              {chain.name}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Transfer
          key={selectedChain}
          title="Single Chain Transfer"
          initialFromChain={selectedChain}
          initialToChain={selectedChain}
          onSuccess={(result) => {
            console.log(\`\${selectedChain}-Chain transfer successful:\`, result);
          }}
          onError={(error) => {
            console.error(\`\${selectedChain}-Chain transfer error:\`, error);
          }}
        />
      </CardContent>
    </Card>
  );
}

function App() {
  const availableChains = [avalanche, avalancheFuji];
  
  return (
    <AvalancheProvider availableChains={availableChains}>
      <WalletProvider>
        <SingleChainTransferDemo />
      </WalletProvider>
    </AvalancheProvider>
  );
}`}
                        language="tsx"
                      >
                        <SingleChainTransferDemo />
                      </ComponentWithCode>
                      <ComponentWithCode
                        title="Simple Transfer"
                        description="One-click AVAX transfer with predefined values"
                        code={`import React from 'react';
import { AvalancheProvider, WalletProvider, TransferProvider, useTransferContext, TransferButton, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@avalanche-sdk/ui';
import { avalanche, avalancheFuji } from '@avalanche-sdk/client/chains';

function SimpleTransferContent() {
  const { setAmount, setToAddress } = useTransferContext();
  const predefinedAddress = "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC";
  const predefinedAmount = "0.1";

  React.useEffect(() => {
    setToAddress(predefinedAddress);
    setAmount(predefinedAmount);
  }, [setToAddress, setAmount]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Payment</CardTitle>
        <CardDescription>Send AVAX on C-Chain with one click</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          <strong>To:</strong> {predefinedAddress}
        </div>
        <div className="text-sm">
          <strong>Amount:</strong> {predefinedAmount} AVAX
        </div>
        <TransferButton text={\`Send \${predefinedAmount} AVAX\`} />
      </CardContent>
    </Card>
  );
}

function SimpleTransfer() {
  return (
    <TransferProvider
      initialFromChain="C"
      initialToChain="C"
      onSuccess={(result) => {
        console.log('Transfer successful:', result);
      }}
      onError={(error) => {
        console.error('Transfer error:', error);
      }}
    >
      <SimpleTransferContent />
    </TransferProvider>
  );
}

function App() {
  const availableChains = [avalanche, avalancheFuji];
  
  return (
    <AvalancheProvider availableChains={availableChains}>
      <WalletProvider>
        <SimpleTransfer />
      </WalletProvider>
    </AvalancheProvider>
  );
}`}
                        language="tsx"
                      >
                        <SimpleTransfer />
                      </ComponentWithCode>
                </div>
                </div>
              </section>

              {/* ICM (Interchain Messaging) Components */}
                <section id="icm-components" className="component-section">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-foreground mb-2">
                      Interchain Messaging
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      Transfer tokens across Avalanche subnets
                    </p>
                </div>
                  <div className="space-y-6">
                  <ComponentWithCode
                    title="ICTT Demo"
                    description="Bridge tokens between different blockchain networks"
                    code={`import React from 'react';
import { AvalancheProvider, WalletProvider, ICTT, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@avalanche-sdk/ui';
import { avalanche, avalancheFuji } from '@avalanche-sdk/client/chains';

function App() {
  const availableChains = [avalanche, avalancheFuji];
  
  return (
    <AvalancheProvider availableChains={availableChains}>
      <WalletProvider>
        <Card>
          <CardHeader className="pb-6">
            <div className="space-y-1.5">
              <CardTitle>Interchain Token Transfer (ICTT)</CardTitle>
              <CardDescription>Bridge tokens between different blockchain networks</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ICTT
              title="Bridge Tokens"
              allowManualMode={true}
              onSuccess={(result) => {
                console.log('ICTT bridge successful:', result);
              }}
              onError={(error) => {
                console.error('ICTT bridge error:', error);
              }}
            />
          </CardContent>
        </Card>
      </WalletProvider>
    </AvalancheProvider>
  );
}`}
                    language="tsx"
                  >
                    <Card>
                      <CardHeader className="pb-6">
                        <div className="space-y-1.5">
                          <CardTitle>Interchain Token Transfer (ICTT)</CardTitle>
                          <CardDescription>Bridge tokens between different blockchain networks</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ICTT
                          title="Bridge Tokens"
                          allowManualMode={true}
                          onSuccess={(result) => {
                            console.log('ICTT bridge successful:', result);
                          }}
                          onError={(error) => {
                            console.error('ICTT bridge error:', error);
                          }}
                        />
                      </CardContent>
                    </Card>
                  </ComponentWithCode>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                      <ComponentWithCode
                        title="Simple ICTT 1"
                        description="Quick bridge with token chip display"
                        code={`import React from 'react';
import { AvalancheProvider, WalletProvider, ICTTProvider, useICTTContext, ICTTTokenModeToggle, ICTTAmountInput, ICTTButtons, Card, CardContent, CardDescription, CardHeader, CardTitle, WalletConnectionOverlay, ChainLogo } from '@avalanche-sdk/ui';
import { useAvalanche } from '@avalanche-sdk/ui';
import { useWalletContext } from '@avalanche-sdk/ui';
import { echo } from './chains/echo';
import { dispatch } from './chains/dispatch';

function SimpleICTT1Content() {
  const { fromChain, toChain, setFromChain, setToChain, setRecipientAddress } = useICTTContext();
  const { availableChains } = useAvalanche();
  const { address } = useWalletContext();

  React.useEffect(() => {
    setFromChain(echo.id.toString());
    setToChain(dispatch.id.toString());
  }, [setFromChain, setToChain]);

  React.useEffect(() => {
    if (address) {
      setRecipientAddress(address);
    }
  }, [address, setRecipientAddress]);

  const fromChainData = React.useMemo(() => 
    availableChains.find(chain => chain.id.toString() === fromChain),
    [availableChains, fromChain]
  );
  
  const toChainData = React.useMemo(() => 
    availableChains.find(chain => chain.id.toString() === toChain),
    [availableChains, toChain]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between py-4 rounded-xl bg-muted/30">
        <div className="flex items-center gap-3">
          {fromChainData && (
            <ChainLogo 
              chain={fromChainData}
              size={32}
              showLabel={false}
            />
          )}
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">From</span>
            <span className="text-sm font-medium">{fromChainData?.name || 'Echo L1'}</span>
          </div>
        </div>

        <svg 
          className="w-5 h-5 text-muted-foreground" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>

        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-xs text-muted-foreground">To</span>
            <span className="text-sm font-medium">{toChainData?.name || 'Dispatch L1'}</span>
          </div>
          {toChainData && (
            <ChainLogo 
              chain={toChainData}
              size={32}
              showLabel={false}
            />
          )}
        </div>
      </div>

      <ICTTTokenModeToggle allowManualMode={false} />
      <ICTTAmountInput />
      <ICTTButtons />
    </div>
  );
}

function SimpleICTT1() {
  return (
    <ICTTProvider
      onSuccess={(result) => {
        console.log('ICTT transfer successful:', result);
      }}
      onError={(error) => {
        console.error('ICTT transfer error:', error);
      }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Quick Bridge</CardTitle>
          <CardDescription>Transfer tokens from Echo L1 to Dispatch L1</CardDescription>
        </CardHeader>
        <CardContent>
          <WalletConnectionOverlay>
            <SimpleICTT1Content />
          </WalletConnectionOverlay>
        </CardContent>
      </Card>
    </ICTTProvider>
  );
}

function App() {
  const availableChains = [avalanche, avalancheFuji, echo, dispatch];
  
  return (
    <AvalancheProvider availableChains={availableChains}>
      <WalletProvider>
        <SimpleICTT1 />
      </WalletProvider>
    </AvalancheProvider>
  );
}`}
                        language="tsx"
                      >
                        <SimpleICTT1 />
                      </ComponentWithCode>
                      <ComponentWithCode
                        title="Simple ICTT 2"
                        description="Instant bridge with token pre-selected"
                        code={`import React from 'react';
import { AvalancheProvider, WalletProvider, ICTTProvider, useICTTContext, ICTTButtons, Card, CardContent, CardDescription, CardHeader, CardTitle, WalletConnectionOverlay, ChainLogo } from '@avalanche-sdk/ui';
import { useAvalanche } from '@avalanche-sdk/ui';
import { useWalletContext } from '@avalanche-sdk/ui';
import { echo } from './chains/echo';
import { dispatch } from './chains/dispatch';

function SimpleICTT2Content() {
  const { fromChain, toChain, setFromChain, setToChain, setRecipientAddress, setSelectedToken, setAmount, availableTokens } = useICTTContext();
  const { availableChains } = useAvalanche();
  const { address } = useWalletContext();

  React.useEffect(() => {
    setFromChain(echo.id.toString());
    setToChain(dispatch.id.toString());
  }, [setFromChain, setToChain]);

  React.useEffect(() => {
    if (address) {
      setRecipientAddress(address);
    }
  }, [address, setRecipientAddress]);

  React.useEffect(() => {
    if (availableTokens && availableTokens.length > 0) {
      setSelectedToken(availableTokens[0]);
      setAmount('15');
    }
  }, [availableTokens, setSelectedToken, setAmount]);

  const fromChainData = React.useMemo(() => 
    availableChains.find(chain => chain.id.toString() === fromChain),
    [availableChains, fromChain]
  );
  
  const toChainData = React.useMemo(() => 
    availableChains.find(chain => chain.id.toString() === toChain),
    [availableChains, toChain]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between py-4 rounded-xl bg-muted/30">
        <div className="flex items-center gap-3">
          {fromChainData && (
            <ChainLogo 
              chain={fromChainData}
              size={32}
              showLabel={false}
            />
          )}
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">From</span>
            <span className="text-sm font-medium">{fromChainData?.name || 'Echo L1'}</span>
          </div>
        </div>

        <svg 
          className="w-5 h-5 text-muted-foreground" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>

        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-xs text-muted-foreground">To</span>
            <span className="text-sm font-medium">{toChainData?.name || 'Dispatch L1'}</span>
          </div>
          {toChainData && (
            <ChainLogo 
              chain={toChainData}
              size={32}
              showLabel={false}
            />
          )}
        </div>
      </div>

      <ICTTButtons />
    </div>
  );
}

function SimpleICTT2() {
  return (
    <ICTTProvider
      onSuccess={(result) => {
        console.log('ICTT transfer successful:', result);
      }}
      onError={(error) => {
        console.error('ICTT transfer error:', error);
      }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Instant Bridge</CardTitle>
          <CardDescription>One-click token bridge from Echo L1 to Dispatch L1</CardDescription>
        </CardHeader>
        <CardContent>
          <WalletConnectionOverlay>
            <SimpleICTT2Content />
          </WalletConnectionOverlay>
        </CardContent>
      </Card>
    </ICTTProvider>
  );
}

function App() {
  const availableChains = [avalanche, avalancheFuji, echo, dispatch];
  
  return (
    <AvalancheProvider availableChains={availableChains}>
      <WalletProvider>
        <SimpleICTT2 />
      </WalletProvider>
    </AvalancheProvider>
  );
}`}
                        language="tsx"
                      >
                        <SimpleICTT2 />
                      </ComponentWithCode>
                </div>
                </div>
              </section>

              {/* Staking Components */}
                <section id="staking-components" className="component-section">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-foreground mb-2">
                      Staking Components
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      Stake AVAX and manage validators
                    </p>
                </div>
                    <ComponentWithCode
                      title="Stake Demo"
                      description="Stake AVAX as a validator on Avalanche's Primary Network"
                      code={`import { AvalancheProvider, WalletProvider, Stake } from '@avalanche-sdk/ui';
import { avalanche, avalancheFuji } from '@avalanche-sdk/client/chains';

function App() {
  const availableChains = [avalanche, avalancheFuji];
  
  return (
    <AvalancheProvider availableChains={availableChains}>
      <WalletProvider>
        <Stake
            onSuccess={(result) => {
              console.log('Stake successful:', result);
            }}
            onError={(error) => {
              console.error('Stake error:', error);
            }}
            networkConfig={{
              minStakeAvax: 1,
              minEndSeconds: 24 * 60 * 60, // 24 hours
              defaultDays: 1,
            }}
          />
      </WalletProvider>
    </AvalancheProvider>
  );
}`}
                      language="tsx"
                    >
                      <Stake
                          onSuccess={(result) => {
                            console.log('Stake successful:', result);
                          }}
                          onError={(error) => {
                            console.error('Stake error:', error);
                          }}
                          networkConfig={{
                            minStakeAvax: 1,
                            minEndSeconds: 24 * 60 * 60, // 24 hours
                            defaultDays: 1,
                          }}
                        />
                    </ComponentWithCode>
              </section>

              {/* Earn Components */}
                <section id="earn-components" className="component-section">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-foreground mb-2">
                      Earn Components
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      Earn yield on your assets with AAVE and Benqi liquidity pools
                    </p>
                  </div>
                  <div className="space-y-6">
                    {/* Earn Component - Full Featured */}
                    <ComponentWithCode
                      title="Earn Component"
                      description="Full-featured earn interface with pool selection, deposit, withdraw, and claim"
                      code={`import { AvalancheProvider, WalletProvider, Earn } from '@avalanche-sdk/ui';
import { avalanche } from '@avalanche-sdk/client/chains';

function App() {
  const availableChains = [avalanche];
  
  return (
    <AvalancheProvider availableChains={availableChains}>
      <WalletProvider>
        <Earn
          initialProvider="aave"
          initialChainId="43114"
          onSuccess={(result) => {
            console.log('Earn action successful:', result);
          }}
          onError={(error) => {
            console.error('Earn error:', error);
          }}
          onStatusChange={(status) => {
            console.log('Earn status:', status);
          }}
        />
      </WalletProvider>
    </AvalancheProvider>
  );
}`}
                      language="tsx"
                    >
                      <Earn
                        initialProvider="aave"
                        initialChainId="43114"
                        onSuccess={(result) => {
                          console.log('Earn action successful:', result);
                        }}
                        onError={(error) => {
                          console.error('Earn error:', error);
                        }}
                        onStatusChange={(status) => {
                          console.log('Earn status:', status);
                        }}
                      />
                    </ComponentWithCode>

                    {/* Single Pool Demos */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                      <ComponentWithCode
                        title="AAVE Single Pool Card"
                        description="Display a specific AAVE pool by provider, chain, and pool address"
                        code={`import React from 'react';
import { AvalancheProvider, WalletProvider, EarnSinglePoolCard } from '@avalanche-sdk/ui';
import { avalanche } from '@avalanche-sdk/client/chains';
import type { ChainConfig } from '@avalanche-sdk/ui';

function EarnDemo1() {
  const avalancheChain = avalanche as ChainConfig;
  
  return (
    <EarnSinglePoolCard
      provider="aave"
      chain={avalancheChain}
      poolAddress="0x625E7708f30cA75bfd92586e17077590C60eb4cD"
      title="AAVE USDC Pool"
      onSuccess={(result) => {
        console.log('Single pool action successful:', result);
      }}
      onError={(error) => {
        console.error('Single pool error:', error);
      }}
    />
  );
}

function App() {
  const availableChains = [avalanche];
  
  return (
    <AvalancheProvider availableChains={availableChains}>
      <WalletProvider>
        <EarnDemo1 />
      </WalletProvider>
    </AvalancheProvider>
  );
}`}
                        language="tsx"
                      >
                        <EarnDemo1 />
                      </ComponentWithCode>

                      <ComponentWithCode
                        title="Benqi Single Pool Card"
                        description="Display a specific Benqi pool by provider, chain, and pool address"
                        code={`import React from 'react';
import { AvalancheProvider, WalletProvider, EarnSinglePoolCard } from '@avalanche-sdk/ui';
import { avalanche } from '@avalanche-sdk/client/chains';
import type { ChainConfig } from '@avalanche-sdk/ui';

function EarnDemo2() {
  const avalancheChain = avalanche as ChainConfig;
  
  return (
    <EarnSinglePoolCard
      provider="benqi"
      chain={avalancheChain}
      poolAddress="0xF362feA9659cf036792c9cb02f8ff8198E21B4cB"
      title="Benqi sAVAX Pool"
      onSuccess={(result) => {
        console.log('Single pool action successful:', result);
      }}
      onError={(error) => {
        console.error('Single pool error:', error);
      }}
    />
  );
}

function App() {
  const availableChains = [avalanche];
  
  return (
    <AvalancheProvider availableChains={availableChains}>
      <WalletProvider>
        <EarnDemo2 />
      </WalletProvider>
    </AvalancheProvider>
  );
}`}
                        language="tsx"
                      >
                        <EarnDemo2 />
                      </ComponentWithCode>
                    </div>
                  </div>
              </section>
            </main>
              
              {/* Footer */}
              <Footer />
          </div>
        </div>
      </WalletProvider>
    </AvalancheProvider>
    </ThemeProvider>
  );
}

export default App;
