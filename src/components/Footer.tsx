import React from 'react';
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  PinIcon,
  HomeIcon } from
'lucide-react';
export function Footer() {
  return (
    <footer className="w-full bg-[#F5F5F5] pt-16 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Logo */}
        <div className="mb-12">
          <a href="#/" className="flex items-center">
            <img
              src="/chasebank.png"
              alt="Crest"
              className="h-8 object-contain" />
            
          </a>
        </div>

        {/* Main Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 text-sm text-gray-600">
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Checking Accounts</h4>
            <p className="mb-4">
              Choose the{' '}
              <a
                href="#/feature/checking"
                className="text-[#0060AF] hover:underline">
                
                checking account
              </a>{' '}
              that works best for you. See our{' '}
              <a
                href="#/feature/checking"
                className="text-[#0060AF] hover:underline">
                
                Crest Total Checking®
              </a>{' '}
              offer for new customers. Make purchases with your debit card, and
              bank from almost anywhere by phone, tablet or computer and more
              than 14,000 ATMs and 5,000 branches.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">
              Savings Accounts & CDs
            </h4>
            <p className="mb-4">
              It's never too early to begin saving.{' '}
              <a
                href="#/feature/savings"
                className="text-[#0060AF] hover:underline">
                
                Open a savings account
              </a>{' '}
              or open a Certificate of Deposit (
              <a
                href="#/feature/savings"
                className="text-[#0060AF] hover:underline">
                
                see interest rates
              </a>
              ) and start saving your money.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Credit Cards</h4>
            <p className="mb-4">
              Crest{' '}
              <a
                href="#/feature/credit-cards"
                className="text-[#0060AF] hover:underline">
                
                credit cards
              </a>{' '}
              can help you buy the things you need. Many of our cards{' '}
              <a
                href="#/feature/credit-cards"
                className="text-[#0060AF] hover:underline">
                
                offer rewards
              </a>{' '}
              that can be redeemed for{' '}
              <a
                href="#/feature/credit-cards"
                className="text-[#0060AF] hover:underline">
                
                cash back
              </a>{' '}
              or{' '}
              <a
                href="#/feature/credit-cards"
                className="text-[#0060AF] hover:underline">
                
                travel-related
              </a>{' '}
              perks. With so many options, it can be easy to find a card that
              matches your lifestyle. Plus, with Credit Journey you can get a{' '}
              <a
                href="#/feature/credit-score"
                className="text-[#0060AF] hover:underline">
                
                free credit score
              </a>
              !
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Mortgages</h4>
            <p className="mb-4">
              Apply for a{' '}
              <a
                href="#/feature/home-loans"
                className="text-[#0060AF] hover:underline">
                
                mortgage
              </a>{' '}
              or{' '}
              <a
                href="#/feature/home-loans"
                className="text-[#0060AF] hover:underline">
                
                refinance your mortgage
              </a>{' '}
              with Crest. View today's{' '}
              <a
                href="#/feature/home-loans"
                className="text-[#0060AF] hover:underline">
                
                mortgage rates
              </a>{' '}
              or calculate what you can afford with our{' '}
              <a
                href="#/feature/home-loans"
                className="text-[#0060AF] hover:underline">
                
                mortgage calculator
              </a>
              . Visit our{' '}
              <a
                href="#/feature/home-loans"
                className="text-[#0060AF] hover:underline">
                
                Education Center
              </a>{' '}
              for homebuying tips and more.
            </p>
          </div>
        </div>

        <hr className="border-gray-300 mb-8" />

        {/* Secondary Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 text-sm text-gray-600">
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Auto</h4>
            <p>
              <a
                href="#/feature/auto"
                className="text-[#0060AF] hover:underline">
                
                Crest Auto
              </a>{' '}
              is here to help you get the right car. Apply for{' '}
              <a
                href="#/feature/auto"
                className="text-[#0060AF] hover:underline">
                
                auto financing
              </a>{' '}
              for a new or used car with Crest. Use the{' '}
              <a
                href="#/feature/auto"
                className="text-[#0060AF] hover:underline">
                
                payment calculator
              </a>{' '}
              to estimate monthly payments. Check out the{' '}
              <a
                href="#/feature/auto"
                className="text-[#0060AF] hover:underline">
                
                Crest Auto Education Center
              </a>{' '}
              to get car guidance from a trusted source.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Chase for Business</h4>
            <p>
              With Crest for Business you'll receive guidance from a team of
              business professionals who specialize in helping improve cash
              flow, providing credit solutions, and managing payroll. Choose
              from{' '}
              <a
                href="#/feature/business"
                className="text-[#0060AF] hover:underline">
                
                business checking
              </a>
              ,{' '}
              <a
                href="#/feature/business"
                className="text-[#0060AF] hover:underline">
                
                small business loans
              </a>
              ,{' '}
              <a
                href="#/feature/business"
                className="text-[#0060AF] hover:underline">
                
                business credit cards
              </a>
              ,{' '}
              <a
                href="#/feature/business"
                className="text-[#0060AF] hover:underline">
                
                merchant services
              </a>{' '}
              or visit our{' '}
              <a
                href="#/feature/business"
                className="text-[#0060AF] hover:underline">
                
                business resource center
              </a>
              .
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">
              Sports & Entertainment
            </h4>
            <p>
              Crest gives you access to unique sports, entertainment and
              culinary events through{' '}
              <a
                href="#/feature/entertainment"
                className="text-[#0060AF] hover:underline">
                
                Crest Experiences
              </a>{' '}
              and our exclusive partnerships such as the{' '}
              <a
                href="#/feature/entertainment"
                className="text-[#0060AF] hover:underline">
                
                US Open
              </a>
              ,{' '}
              <a
                href="#/feature/entertainment"
                className="text-[#0060AF] hover:underline">
                
                Madison Square Garden
              </a>{' '}
              and{' '}
              <a
                href="#/feature/entertainment"
                className="text-[#0060AF] hover:underline">
                
                Crest Center
              </a>
              .
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">
              Crest Security Center
            </h4>
            <p>
              Our{' '}
              <a
                href="#/feature/security"
                className="text-[#0060AF] hover:underline">
                
                suite of security features
              </a>{' '}
              can{' '}
              <a
                href="#/feature/security"
                className="text-[#0060AF] hover:underline">
                
                help you protect
              </a>{' '}
              your info, money and give you peace of mind. See how we're
              dedicated to helping{' '}
              <a
                href="#/feature/security"
                className="text-[#0060AF] hover:underline">
                
                protect you
              </a>
              , your accounts and your loved ones from{' '}
              <a
                href="#/feature/security"
                className="text-[#0060AF] hover:underline">
                
                financial abuse
              </a>
              . Also,{' '}
              <a
                href="#/feature/security"
                className="text-[#0060AF] hover:underline">
                
                learn about the common tricks scammers are using
              </a>{' '}
              to help you stay one step ahead of them. If you see unauthorized
              charges or believe your account was compromised contact us right
              away to{' '}
              <a
                href="#/feature/security"
                className="text-[#0060AF] hover:underline">
                
                report fraud
              </a>
              .
            </p>
          </div>
        </div>

        <hr className="border-gray-300 mb-8" />

        {/* Tertiary Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-sm text-gray-600">
          <div>
            <h4 className="font-bold text-gray-900 mb-4">About Crest</h4>
            <p>
              Crest serves millions of people with a broad range of products.{' '}
              <a
                href="#/feature/about"
                className="text-[#0060AF] hover:underline">
                
                Crest online
              </a>{' '}
              lets you manage your Crest accounts, view statements, monitor
              activity, pay bills or transfer funds securely from one central
              place. To learn more, visit the{' '}
              <a
                href="#/feature/about"
                className="text-[#0060AF] hover:underline">
                
                Banking Education Center
              </a>
              . For questions or concerns, please contact{' '}
              <a
                href="#/feature/about"
                className="text-[#0060AF] hover:underline">
                
                Crest customer service
              </a>{' '}
              or let us know about{' '}
              <a
                href="#/feature/about"
                className="text-[#0060AF] hover:underline">
                
                Crest complaints and feedback
              </a>
              . View the{' '}
              <a
                href="#/feature/about"
                className="text-[#0060AF] hover:underline">
                
                Crest Community Reinvestment Act Public File
              </a>{' '}
              for the bank's latest CRA rating and other CRA-related
              information.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">
              Investing by crypto
            </h4>
            <p className="mb-4">
              Partner with a global leader who puts your financial needs first.{' '}
              <a
                href="#/feature/investing"
                className="text-[#0060AF] hover:underline">
                
                Invest on your own
              </a>{' '}
              or{' '}
              <a
                href="#/feature/investing"
                className="text-[#0060AF] hover:underline">
                
                work with an advisor
              </a>{' '}
              — we have the{' '}
              <a
                href="#/feature/investing"
                className="text-[#0060AF] hover:underline">
                
                products, technology
              </a>{' '}
              and{' '}
              <a
                href="#/feature/investing"
                className="text-[#0060AF] hover:underline">
                
                investment education
              </a>
              , to help you grow your wealth. Visit a J.P. Morgan{' '}
              <a
                href="#/feature/investing"
                className="text-[#0060AF] hover:underline">
                
                Wealth Management Branch
              </a>{' '}
              or check out our latest online investing{' '}
              <a
                href="#/feature/investing"
                className="text-[#0060AF] hover:underline">
                
                features, offers, promotions, and coupons
              </a>
              .
            </p>
            <p className="font-bold text-gray-900 mb-2">
              INVESTMENT AND INSURANCE PRODUCTS ARE:
            </p>
            <ul className="list-disc pl-5 font-bold text-gray-900 space-y-1">
              <li>NOT FDIC INSURED</li>
              <li>NOT INSURED BY ANY FEDERAL GOVERNMENT AGENCY</li>
              <li>
                NOT A DEPOSIT OR OTHER OBLIGATION OF, OR GUARANTEED BY,
                CREST BANK, N.A. OR ANY OF ITS AFFILIATES
              </li>
              <li>
                SUBJECT TO INVESTMENT RISKS, INCLUDING POSSIBLE LOSS OF THE
                PRINCIPAL AMOUNT INVESTED
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">
              Crest Private Client
            </h4>
            <p className="mb-4">
              Get more from a personalized relationship offering{' '}
              <a
                href="#/feature/private-client"
                className="text-[#0060AF] hover:underline">
                
                no everyday banking fees
              </a>
              , priority service from a{' '}
              <a
                href="#/feature/private-client"
                className="text-[#0060AF] hover:underline">
                
                dedicated team
              </a>{' '}
              and{' '}
              <a
                href="#/feature/private-client"
                className="text-[#0060AF] hover:underline">
                
                special perks and benefits
              </a>
              . Connect with a Chase Private Client Banker at your nearest{' '}
              <a
                href="#/feature/private-client"
                className="text-[#0060AF] hover:underline">
                
                Crest branch
              </a>{' '}
              to learn about eligibility requirements and all available
              benefits.
            </p>
            <p className="font-bold text-gray-900 mb-2">
              INVESTMENT AND INSURANCE PRODUCTS ARE:
            </p>
            <ul className="list-disc pl-5 font-bold text-gray-900 space-y-1">
              <li>NOT A DEPOSIT</li>
              <li>NOT FDIC INSURED</li>
              <li>NOT INSURED BY ANY FEDERAL GOVERNMENT AGENCY</li>
              <li>NO BANK GUARANTEE</li>
              <li>MAY LOSE VALUE</li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-300 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div className="flex flex-wrap gap-4 text-sm font-medium">
            <span className="text-gray-900">Other Products & Services:</span>
            <a
              href="#/feature/agreements"
              className="text-[#0060AF] hover:underline">
              
              Deposit Account Agreements
            </a>
            <a
              href="#/feature/mobile"
              className="text-[#0060AF] hover:underline">
              
              Mobile Banking
            </a>
            <a
              href="#/feature/online"
              className="text-[#0060AF] hover:underline">
              
              Online Banking
            </a>
            <a
              href="#/feature/student"
              className="text-[#0060AF] hover:underline">
              
              Student Center
            </a>
            <a
              href="#/feature/zelle"
              className="text-[#0060AF] hover:underline">
              
              Zelle®
            </a>
          </div>

          <div className="flex space-x-4 text-gray-500">
            <a href="#" className="hover:text-gray-900">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-gray-900">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-gray-900">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-gray-900">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-gray-900">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-gray-900">
              <PinIcon className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="text-xs text-gray-500 space-y-4 mb-8">
          <p>
            "Crest,"" the Anthony Crest logo and
            the C Symbol are trademarks of Anthony Crest Bank, N.A.
            Anthony Crest Bank, N.A. is a wholly-owned subsidiary of Anthony
            Crest & Co.
          </p>
          <p>
            Bank deposit accounts, such as checking and savings, may be subject
            to approval. Deposit products and related services are offered by
            Crest Bank, N.A. Member FDIC.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-600 mb-8">
          <a href="#" className="hover:underline">
            Anthony Crest
          </a>
          <a href="#" className="hover:underline">
            AnthonyCrest
          </a>
          <a href="#" className="hover:underline">
            Media Center
          </a>
          <a href="#" className="hover:underline">
            Careers
          </a>
          <a href="#" className="hover:underline">
            Site Map
          </a>
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <a href="#" className="hover:underline">
            Security
          </a>
          <a href="#" className="hover:underline">
            Terms of Use
          </a>
          <a href="#" className="hover:underline">
            Accessibility
          </a>
          <a href="#" className="hover:underline">
            AdChoices
          </a>
          <a href="#" className="hover:underline">
            Give feedback
          </a>
          <a href="#" className="hover:underline">
            Member FDIC
          </a>
          <span className="flex items-center">
            <HomeIcon className="w-3 h-3 mr-1" /> Equal Housing Opportunity
          </span>
        </div>

        <div className="text-xs text-gray-500">
          © 2026 JPMorgan Chase & Co.
        </div>
      </div>
    </footer>);

}
