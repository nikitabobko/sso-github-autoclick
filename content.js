(function() {
  function isSSOPage() {
    const title = document.title || '';
    const ssoLink = document.querySelector('link[rel="sso-modal"]');
    return title.includes('Sign in to') && ssoLink !== null;
  }

  function clickContinue() {
    const button = document.querySelector('button[type="submit"]');
    if (button && button.textContent.trim() === 'Continue') {
      button.click();
      console.log('GitHub SSO Auto-Continue: Clicked Continue button');
    }
  }

  if (isSSOPage()) {
    if (document.readyState === 'complete') {
      clickContinue();
    } else {
      window.addEventListener('load', clickContinue);
    }

    const observer = new MutationObserver(clickContinue);
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
