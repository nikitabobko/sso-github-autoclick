(function() {
  let googleAccountObserver = null;

  function isGitHubSSOPage() {
    const title = document.title || '';
    const ssoLink = document.querySelector('link[rel="sso-modal"]');
    return title.includes('Sign in to') && ssoLink !== null;
  }

  function isGoogleAccountChooser() {
    return window.location.hostname.includes('accounts.google.com') &&
           (window.location.pathname.includes('/signin/') || 
            window.location.pathname.includes('/v3/signin/'));
  }

  function clickContinue() {
    const button = document.querySelector('button[type="submit"]');
    if (button && button.textContent.trim() === 'Continue') {
      button.click();
      console.log('GitHub SSO Auto-Continue: Clicked Continue button');
    }
  }

  function getAccountElements() {
    const selectors = [
      '#account-chooser-list li',
      '.account-chooser-list-item',
      'div[data-email]',
      'li[role="option"]',
      'div.zwRHlb',
      'li.aZvCDf',
    ];
    
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        return elements;
      }
    }
    return document.querySelectorAll('div[role="button"], div[role="link"]');
  }

  function extractEmail(element) {
    const dataEmail = element.getAttribute('data-email');
    if (dataEmail) {
      return dataEmail.toLowerCase();
    }
    const nestedEmailEl = element.querySelector('[data-email]');
    if (nestedEmailEl) {
      return nestedEmailEl.getAttribute('data-email').toLowerCase();
    }
    return null;
  }

  function isGmail(email) {
    return email && email.endsWith('@gmail.com');
  }

  function disconnectGoogleObserver() {
    if (googleAccountObserver) {
      googleAccountObserver.disconnect();
      googleAccountObserver = null;
    }
  }

  async function handleGoogleAccountChooser() {
    console.log('GitHub SSO Auto-Continue: Handle Google Accounts chooser');
    await new Promise(resolve => setTimeout(resolve, 500));

    const accounts = getAccountElements();
    if (accounts.length === 0) {
      console.log('GitHub SSO Auto-Continue: No Google accounts are found');
      return;
    }

    const accountEmails = [];
    accounts.forEach(acc => {
      const email = extractEmail(acc);
      if (email) {
        accountEmails.push({ element: acc, email });
      } else {
        console.log('GitHub SSO Auto-Continue: Can\'t extract an email')
      }
    });

    if (accountEmails.length === 0) {
      console.log('GitHub SSO Auto-Continue: No Google account emails are found');
      return;
    }

    const { savedEmail } = await chrome.storage.local.get('savedEmail');
    
    if (savedEmail) {
      const savedAccount = accountEmails.find(a => a.email === savedEmail);
      if (savedAccount) {
        disconnectGoogleObserver();
        savedAccount.element.click();
        console.log('GitHub SSO Auto-Continue: Clicked saved account');
        return;
      }
    }

    if (accountEmails.length === 1) {
      disconnectGoogleObserver();
      accountEmails[0].element.click();
      console.log('GitHub SSO Auto-Continue: Clicked single account');
      return;
    }

    const nonGmailAccounts = accountEmails.filter(a => !isGmail(a.email));
    if (nonGmailAccounts.length === 1) {
      disconnectGoogleObserver();
      nonGmailAccounts[0].element.click();
      console.log('GitHub SSO Auto-Continue: Clicked single non-gmail account');
      return;
    }

    const handleClick = async (event) => {
      const target = event.target.closest('div[role="button"]') || event.target;
      const email = extractEmail(target);
      if (email && accountEmails.some(a => a.email === email)) {
        await chrome.storage.local.set({ savedEmail: email });
        console.log('GitHub SSO Auto-Continue: Saved user selection');
      }
    };

    console.log('GitHub SSO Auto-Continue: add click event listener')
    document.querySelector('body').addEventListener('click', handleClick, { once: true });
  }

  if (isGitHubSSOPage()) {
    if (document.readyState === 'complete') {
      clickContinue();
    } else {
      window.addEventListener('load', clickContinue);
    }

    const observer = new MutationObserver(clickContinue);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (isGoogleAccountChooser()) {
    handleGoogleAccountChooser();

    googleAccountObserver = new MutationObserver(handleGoogleAccountChooser);
    googleAccountObserver.observe(document.body, { childList: true, subtree: true });
  }

})();
