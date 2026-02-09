// Google Analytics 4 integration
export const GA_TRACKING_ID = 'G-3KEL8Z38S9';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
  }
}

// Initialize Google Analytics 4
export const initGA = () => {
  if (typeof window === 'undefined') return;

  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.gtag = window.gtag || function() {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

// Facebook Pixel integration
export const FB_PIXEL_ID = '1433456280360129';

export const initFacebookPixel = () => {
  if (typeof window === 'undefined') return;

  // Facebook Pixel Code - simplified initialization
  const script = document.createElement('script');
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${FB_PIXEL_ID}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(script);
};

// Analytics Events
export const analytics = {
  // Page views
  pageView: (path: string, title?: string) => {
    if (typeof window === 'undefined') return;
    
    window.gtag?.('config', GA_TRACKING_ID, {
      page_path: path,
      page_title: title || document.title,
    });
  },

  // E-commerce events
  addToCart: (productId: string, productName: string, price: number, quantity: number = 1) => {
    if (typeof window === 'undefined') return;
    
    // GA4 Event
    window.gtag?.('event', 'add_to_cart', {
      currency: 'BRL',
      value: price * quantity,
      items: [{
        item_id: productId,
        item_name: productName,
        currency: 'BRL',
        price: price,
        quantity: quantity
      }]
    });

    // Facebook Pixel Event
    window.fbq?.('track', 'AddToCart', {
      content_ids: [productId],
      content_name: productName,
      content_type: 'product',
      value: price * quantity,
      currency: 'BRL'
    });
  },

  viewProduct: (productId: string, productName: string, category: string, price: number) => {
    if (typeof window === 'undefined') return;
    
    // GA4 Event
    window.gtag?.('event', 'view_item', {
      currency: 'BRL',
      value: price,
      items: [{
        item_id: productId,
        item_name: productName,
        item_category: category,
        currency: 'BRL',
        price: price,
        quantity: 1
      }]
    });

    // Facebook Pixel Event
    window.fbq?.('track', 'ViewContent', {
      content_ids: [productId],
      content_name: productName,
      content_category: category,
      content_type: 'product',
      value: price,
      currency: 'BRL'
    });
  },

  beginCheckout: (value: number, items: any[]) => {
    if (typeof window === 'undefined') return;
    
    // GA4 Event
    window.gtag?.('event', 'begin_checkout', {
      currency: 'BRL',
      value: value,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        currency: 'BRL',
        price: item.price,
        quantity: item.quantity
      }))
    });

    // Facebook Pixel Event
    window.fbq?.('track', 'InitiateCheckout', {
      content_ids: items.map(item => item.id),
      content_type: 'product',
      value: value,
      currency: 'BRL',
      num_items: items.reduce((sum, item) => sum + item.quantity, 0)
    });
  },

  purchase: (transactionId: string, value: number, items: any[]) => {
    if (typeof window === 'undefined') return;
    
    // GA4 Event
    window.gtag?.('event', 'purchase', {
      transaction_id: transactionId,
      currency: 'BRL',
      value: value,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        currency: 'BRL',
        price: item.price,
        quantity: item.quantity
      }))
    });

    // Facebook Pixel Event
    window.fbq?.('track', 'Purchase', {
      content_ids: items.map(item => item.id),
      content_type: 'product',
      value: value,
      currency: 'BRL'
    });
  },

  // Custom events
  searchProducts: (searchTerm: string) => {
    if (typeof window === 'undefined') return;
    
    window.gtag?.('event', 'search', {
      search_term: searchTerm
    });

    window.fbq?.('track', 'Search', {
      search_string: searchTerm
    });
  },

  contactWhatsApp: (source: string) => {
    if (typeof window === 'undefined') return;
    
    window.gtag?.('event', 'contact', {
      method: 'whatsapp',
      source: source
    });

    window.fbq?.('track', 'Contact', {
      content_name: 'WhatsApp Contact',
      source: source
    });
  },

  calculateShipping: (cep: string) => {
    if (typeof window === 'undefined') return;
    
    window.gtag?.('event', 'calculate_shipping', {
      cep: cep
    });
  }
};

// Initialize both analytics services
export const initAnalytics = () => {
  if (typeof window === 'undefined') return;
  
  initGA();
  initFacebookPixel();
  
  console.log('Analytics initialized (GA4 + Facebook Pixel)');
};