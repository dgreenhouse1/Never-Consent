(function () {
  function kickQuantcast (mutations) {
    var qcReady = mutations.some(mutation => {
      return mutation.target.firstChild &&
        mutation.target.firstChild.classList &&
        mutation.target.firstChild.classList.contains('qc-cmp-ui-container')
    });

    if (qcReady) {
      window.__cmpui('setAndSaveAllConsent', false);
    }
  }

  function registerCookie (newCookie) {
    if (!document.cookie.indexOf(newCookie)) {
      document.cookie = newCookie;
    }
  }

  function waitForElement (selector, callback, maybeTimer = false) {
    if (!eleWaiter) {
      eleWaiter = window.setInterval(() => {
        const eleSelected = document.querySelector(selector);
        if (eleSelected) {
          window.clearInterval(eleWaiter);
          window.clearTimeout(eleMaybeWaiter);
          eleWaiter = false;

          callback(eleSelected);
        }
      }, 10);
      if (maybeTimer) {
        eleMaybeWaiter = window.setTimeout(() => {
          window.clearInterval(eleWaiter);

          callback(null);
        }, maybeTimer);
      }
    }
  }

  function elClick (selector, callback, {
    targetParent = false,
    maybeTimer = false
  } = {}) {
    waitForElement(selector, () => {
      if (targetParent) {
        document.querySelector(selector).parentNode.click();
      } else {
        document.querySelector(selector).click();
      }

      if (callback) {
        callback();
      }
    }, maybeTimer);
  }

  function fireEvent (selector, event) {
    if (document.querySelector(selector)) {
      const evObj = document.createEvent('Events');
      evObj.initEvent(event, true, false);
      document.querySelector(selector).dispatchEvent(evObj);
    }
  }

  function didMoronUnderstood () {
    kickMoron += 1;
    return 30 <= kickMoron;
  }

  registerCookie('cookieconsent_status=deny');
  registerCookie('notice_preferences=0:');
  registerCookie('cabinet_bedin_cookies=eyJ3ZWJzaXRlIjpmYWxzZSwiZ29vZ2xlIjpmYWxzZSwieW91dHViZSI6ZmFsc2UsInZpbWVvIjpmYWxzZSwiZmJfcGl4ZWwiOmZhbHNlLCJzb2NpYWxzIjpmYWxzZX0=:');
  registerCookie('notice_gdpr_prefs=0:');

  // quantcast
  (new MutationObserver(kickQuantcast)).observe(document.body, {childList: true});

  const domains = {
    'www.greenweez.com': '.cookies_banner',
    'twitter.com': '#banners',
    'www.cabinet-bedin.com': '#cookie_headband'
  };

  let kickMoron = 0;
  let eleWaiter = false;
  let eleMaybeWaiter = false;

  const kick = setInterval(function () {
    try {
      // Didomi
      if (!!window.Didomi && !!window.didomiOnReady) {
        window.didomiOnReady.push(function (Didomi) {
          if (Didomi.notice.isVisible() && !!Didomi.setUserDisagreeToAll) {
            Didomi.setUserDisagreeToAll();
            document.querySelectorAll('#didomi-host')
              .forEach(function (d) {
                d.setAttribute('aria-hidden', 'true');
                d.style.display = 'none';
              });
          }
        });
        clearInterval(kick);
      }

      // consentmanager
      if (!!window.cmpmngr) {
        window.cmpmngr.setConsentViaBtn(0);

        // It has to be told multiple times "no" to understand "no"
        if (didMoronUnderstood()) {
          clearInterval(kick);
        }
      }

      // cookielawinfo
      if (!!window.CLI && !!window.CLI.reject_close) {
        CLI.reject_close();
        clearInterval(kick);
      }

      // tarteaucitron
      if (!!window.tarteaucitron) {
        tarteaucitron.userInterface.respondAll(false);
        clearInterval(kick);
      }

      // createit
      if (!!window.ct_ultimate_gdpr_cookie) {
        elClick('#ct-ultimate-gdpr-cookie-change-settings', () => {
          elClick('.ct-ultimate-gdpr-cookie-modal-slider [for="cookie0"]', () => {
            elClick('.ct-ultimate-gdpr-cookie-modal-btn.save a', () => {
              clearInterval(kick);
            });
          });
        })
      }

      // cookiebot
      if (!!window.Cookiebot) {
        elClick('#CybotCookiebotDialogBodyButtonDecline', () => {
          clearInterval(kick);
        });
      }

      // crownpeak
      if (!!window.evidon && !!window.evidon.preferencesDialog) {
        elClick('.evidon-consent-button-text', () => {
          window.evidon.preferencesDialog.doWithdrawConsent();
          document.querySelector('#_evh-button').remove();
          clearInterval(kick);
        });
      }
      if (!!window.evidon && !!window.evidon.barrier) {
        elClick('.evidon-barrier-cookiebutton', () => {
          console.error('[extension:Never-Consent] Sadly I can\'t do more for you, I just can display to you the right modal.');
          clearInterval(kick);
        }, {maybeTimer: 2000});
      }
      if (!!window.evidon && !!window.evidon.banner) {
        console.error('[extension:Never-Consent] Evidon banner still not managed');
      }

      // sirdata
      if (!!window.Sddan && window.Sddan.cmpLoaded) {
        elClick('#sd-cmp #main_body button:nth-child(2)', () => {
          elClick('#sd-cmp #details_body + div button', () => clearInterval(kick));
        });
      }

      // appconsent
      if (!!window.__tcfapi) {
        __tcfapi('deny', 2, () => {
        });
      }

      // onetrust
      if (!!window.OneTrust && window.OneTrust.RejectAll) {
        window.OneTrust.RejectAll();
        if (didMoronUnderstood()) {
          clearInterval(kick);
        }
      }

      // klaro
      if (!!window.klaro) {
        if (document.querySelector('.cn-decline')) {
          elClick('.cn-decline');
          clearInterval(kick);
        } else {
          elClick('.cm-learn-more', () => {
            elClick('[for="app-item-disableAll"] .switch .slider', () => {
              elClick('.cn-decline');
              clearInterval(kick);
            });
          });
        }
      }

      // orejime
      if (!!window.orejime) {
        elClick('.orejime-Button--info', () => {
          Object.keys(orejime.internals.manager.consents).forEach(ele => orejime.internals.manager.consents[ele] = false);
          elClick('.orejime-Modal-saveButton', () => {
            clearInterval(kick);
          })
        });
      }

      // axel springer oil
      if (!!window.AS_OIL) {
        AS_OIL.triggerOptOut();
        AS_OIL.showPreferenceCenter();
        elClick('.as-oil__btn-optin.as-js-optin[data-context="YES"]');
        clearInterval(kick);
      }

      // platform behind seloger.com, french flat search engine, still don't know wich one it is
      if (!!window.theShield) {
        fireEvent('#banner-cookie_customize', 'mousedown');

        const switchBoxes = document.querySelectorAll('.slshield-switch input');

        if (switchBoxes.length) {
          switchBoxes
            .forEach(checkbox => {
              if (checkbox.checked) {
                checkbox.click();
              }
            });

          elClick('.slshield-info__cta.slshield-info__cta-accept', () => clearInterval(kick));
        }
      }

      // Sibbo
      if (!!window.SibboCMP && !!SibboCMP.isOpen()) {
        elClick('sibbo-cmp-layout .sibbo-panel__aside a.sibbo-cmp-button[data-nav="purposes"]', () => {
          elClick('sibbo-cmp-layout a.sibbo-cmp-button[data-button-reject-all][data-left="next"]', () => {
            elClick('sibbo-cmp-layout a#purposesNavLegInt', () => {
              elClick('sibbo-cmp-layout a.sibbo-cmp-button[data-button-reject-all][data-left="save-and-exit"]', () => {
                elClick('sibbo-cmp-layout a#purposesLegIntSaveAndExit', () => clearInterval(kick)
                );
              });
            });
          });
        });
      }

      //chandago / sfbx / appconsent
      if (!!window.appconsent && document.getElementById('appconsent') != null && !!appconsent.default && !!appconsent.default.isInitialised) {
        appconsent.default.deny();
        clearInterval(kick);
      }

      // Iubenda
      if (!!window._iub && !!_iub.cs &&
        !!_iub.cs.options && !!_iub.cs.options.callback
        && !!_iub.cs.api && _iub.cs.api.consentGiven) {

        _iub.cs.options.callback.onBannerShown = () => _iub.cs.api.consentGiven('rejectButtonClick');
        clearInterval(kick);
      }
      
      // SourcePoint
      if (window._sp_) {
        x = new XmlHttpRequest();
        x.addEventListener('load', function(e) {
          if (this.responseText) {
            try {
              e = JSON.parse(this.responseText);
              actions = e.actions;
              for (a in actions) {
                f= new Function(a.js);
                return f();
              } catch (e) {
                console.log('Experienced problem with NeverConsent SourcePoint functionality');
              }
            }
          }
        });
        // Still need to add functions to gather the params dynamically from the page
        sp_url = 'https://cdn.privacy-mgmt.com/consent/tcfv2/consent/v3/40?requestUUID=af6953ca-798f-4eb8-b3ba-3324d49d34a6&scriptV2=true&withSiteActions=true&consentUUID=21c09080-4507-43bc-a4ed-b6826f3ad696';           
        sp_data = ‘{"privacyManagerId":"132815","lan":"EN","categories":[],"vendors":[],"specialFeatures":[],"messageId":132815}‘

        x.open('POST', sp_url);
        x.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        x.send(sp_data);
      }
      // End SourcePoint
      
    } catch (except) {
      console.error('[extension:Never-Consent] encountered a problem, please open an issue here https://github.com/MathRobin/Never-Consent/issues');
      console.error('[extension:Never-Consent]', except);
    }
  }, 100);

  const currentDomain = domains[location.hostname];
  if (currentDomain) {
    document.querySelector(currentDomain).remove();
    clearInterval(kick);
  }

  // resign after 20 seconds if nothing managed or detected
  setTimeout(() => {
    clearInterval(kick);
    clearInterval(eleWaiter);
  }, 20000);
})();
