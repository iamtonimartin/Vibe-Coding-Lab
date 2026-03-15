import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ChatWidget() {
  const location = useLocation();
  const isOptInPage = location.pathname === '/freetraining';

  useEffect(() => {
    if (isOptInPage) {
      // If we are on opt-in page, we don't want the widget.
      // If it was already added, we might need to remove it, 
      // but usually the widget script handles its own lifecycle or we can just not inject it.
      const existingScript = document.querySelector('script[src="https://relayapp.ascendz.co/widget.js"]');
      if (existingScript) {
        existingScript.remove();
      }
      // Often widgets also add a div or iframe, we might need to find and remove those too if they persist.
      // For now, let's just ensure it's not added.
      return;
    }

    const script = document.createElement('script');
    script.src = "https://relayapp.ascendz.co/widget.js";
    script.dataset.assistantId = "3c6138bc-0fcd-48ad-87c3-8c6c13ff9ac1";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      // Clean up any elements the widget might have created
      const widgetContainer = document.querySelector('.relay-widget-container') || document.getElementById('relay-widget');
      if (widgetContainer) widgetContainer.remove();
    };
  }, [isOptInPage]);

  return null;
}
