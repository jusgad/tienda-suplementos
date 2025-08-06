/**
 * Tests para AnalyticsService
 * 
 * @jest-environment jsdom
 */

const AnalyticsService = require('../../src/lib/analytics').default;

// Mock de Google Analytics
const mockGtag = jest.fn();
global.window = {
  gtag: mockGtag,
  dataLayer: [],
  location: {
    href: 'https://test.com/test-page'
  },
  document: {
    title: 'Test Page'
  }
};

// Mock document
global.document = {
  title: 'Test Page',
  createElement: jest.fn(() => ({
    src: '',
    async: false
  })),
  head: {
    appendChild: jest.fn()
  }
};

describe('AnalyticsService', () => {
  
  beforeEach(() => {
    // Limpiar mocks antes de cada test
    mockGtag.mockClear();
    if (global.document.createElement.mockClear) {
      global.document.createElement.mockClear();
    }
    if (global.document.head.appendChild.mockClear) {
      global.document.head.appendChild.mockClear();
    }
    
    // Reset initialization state
    AnalyticsService.isInitialized = false;
    
    // Mock environment variable
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-TEST123';
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  });

  describe('Initialization', () => {
    test('debe inicializar Google Analytics correctamente', () => {
      AnalyticsService.init();
      
      expect(global.document.createElement).toHaveBeenCalledWith('script');
      expect(global.document.head.appendChild).toHaveBeenCalled();
    });

    test('no debe inicializar sin MEASUREMENT_ID', () => {
      delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      AnalyticsService.init();
      
      expect(consoleSpy).toHaveBeenCalledWith('🔍 Google Analytics not configured (missing MEASUREMENT_ID)');
      expect(global.document.createElement).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    test('no debe inicializar múltiples veces', () => {
      AnalyticsService.init();
      AnalyticsService.init();
      
      expect(global.document.createElement).toHaveBeenCalledTimes(1);
    });
  });

  describe('Page Tracking', () => {
    test('debe trackear page views', () => {
      AnalyticsService.trackPageView('/test-page');
      
      expect(mockGtag).toHaveBeenCalledWith('config', 'G-TEST123', {
        page_path: '/test-page',
        page_title: 'Test Page',
        page_location: 'https://test.com/test-page'
      });
    });
  });

  describe('E-commerce Tracking', () => {
    const testItem = {
      id: 'prod_123',
      name: 'Test Product',
      category: 'vitaminas',
      price: 29.99,
      quantity: 2
    };

    test('debe trackear compras', () => {
      const items = [testItem];
      AnalyticsService.trackEcommerce.purchase('order_123', items, 59.98, 'EUR');
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'purchase', {
        transaction_id: 'order_123',
        value: 59.98,
        currency: 'EUR',
        items: [{
          item_id: 'prod_123',
          item_name: 'Test Product',
          category: 'vitaminas',
          quantity: 2,
          price: 29.99
        }]
      });
    });

    test('debe trackear añadir al carrito', () => {
      AnalyticsService.trackEcommerce.addToCart(testItem);
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'add_to_cart', {
        currency: 'EUR',
        value: 29.99,
        items: [{
          item_id: 'prod_123',
          item_name: 'Test Product',
          category: 'vitaminas',
          quantity: 2,
          price: 29.99
        }]
      });
    });

    test('debe trackear remover del carrito', () => {
      AnalyticsService.trackEcommerce.removeFromCart(testItem);
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'remove_from_cart', {
        currency: 'EUR',
        value: 29.99,
        items: [{
          item_id: 'prod_123',
          item_name: 'Test Product',
          category: 'vitaminas',
          quantity: 2,
          price: 29.99
        }]
      });
    });

    test('debe trackear vista de producto', () => {
      AnalyticsService.trackEcommerce.viewItem(testItem);
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'view_item', {
        currency: 'EUR',
        value: 29.99,
        items: [{
          item_id: 'prod_123',
          item_name: 'Test Product',
          category: 'vitaminas',
          price: 29.99
        }]
      });
    });

    test('debe trackear inicio de checkout', () => {
      const items = [testItem];
      AnalyticsService.trackEcommerce.beginCheckout(items, 59.98);
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'begin_checkout', {
        currency: 'EUR',
        value: 59.98,
        items: [{
          item_id: 'prod_123',
          item_name: 'Test Product',
          category: 'vitaminas',
          quantity: 2,
          price: 29.99
        }]
      });
    });
  });

  describe('User Tracking', () => {
    test('debe trackear login', () => {
      AnalyticsService.trackUser.login('email');
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'login', {
        method: 'email'
      });
    });

    test('debe trackear registro', () => {
      AnalyticsService.trackUser.signUp('google');
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'sign_up', {
        method: 'google'
      });
    });

    test('debe trackear búsqueda', () => {
      AnalyticsService.trackUser.search('omega 3', 'suplementos');
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'search', {
        search_term: 'omega 3',
        category: 'suplementos'
      });
    });

    test('debe configurar ID de usuario', () => {
      AnalyticsService.trackUser.setUserId('user_123');
      
      expect(mockGtag).toHaveBeenCalledWith('config', 'G-TEST123', {
        user_id: 'user_123'
      });
    });

    test('debe configurar propiedades de usuario', () => {
      const properties = { age: 30, gender: 'female' };
      AnalyticsService.trackUser.setProperties(properties);
      
      expect(mockGtag).toHaveBeenCalledWith('config', 'G-TEST123', {
        custom_map: properties
      });
    });
  });

  describe('Wellness Tracking', () => {
    test('debe trackear inicio de cuestionario', () => {
      AnalyticsService.trackWellness.questionnaireStart();
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'questionnaire_start', {
        event_category: 'wellness',
        event_label: 'wellness_questionnaire'
      });
    });

    test('debe trackear completar cuestionario', () => {
      AnalyticsService.trackWellness.questionnaireComplete(85, 5);
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'questionnaire_complete', {
        event_category: 'wellness',
        event_label: 'wellness_questionnaire',
        value: 85,
        custom_parameter_1: 5
      });
    });

    test('debe trackear añadir consumo', () => {
      AnalyticsService.trackWellness.consumptionAdd('Omega-3', 2);
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'consumption_tracking_add', {
        event_category: 'wellness',
        event_label: 'Omega-3',
        value: 2
      });
    });

    test('debe trackear completar consumo', () => {
      AnalyticsService.trackWellness.consumptionComplete('Multivitamínico', 30);
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'consumption_tracking_complete', {
        event_category: 'wellness',
        event_label: 'Multivitamínico',
        value: 30
      });
    });

    test('debe trackear alerta de reposición', () => {
      AnalyticsService.trackWellness.replenishmentAlert('Vitamina D', 3);
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'replenishment_alert', {
        event_category: 'wellness',
        event_label: 'Vitamina D',
        value: 3
      });
    });
  });

  describe('Engagement Tracking', () => {
    test('debe trackear eventos personalizados', () => {
      const parameters = { category: 'test', value: 100 };
      AnalyticsService.trackEngagement.customEvent('custom_event', parameters);
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'custom_event', parameters);
    });

    test('debe trackear excepciones', () => {
      AnalyticsService.trackEngagement.exception('Test error', true);
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'exception', {
        description: 'Test error',
        fatal: true
      });
    });

    test('debe trackear timing', () => {
      AnalyticsService.trackEngagement.timing('page_load', 1500, 'performance');
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'timing_complete', {
        name: 'page_load',
        value: 1500,
        event_category: 'performance'
      });
    });
  });

  describe('Consent Management', () => {
    test('debe configurar consentimiento otorgado', () => {
      AnalyticsService.setConsent(true);
      
      expect(mockGtag).toHaveBeenCalledWith('consent', 'grant', {
        'analytics_storage': true,
        'functionality_storage': true,
        'security_storage': true
      });
    });

    test('debe configurar consentimiento denegado', () => {
      AnalyticsService.setConsent(false);
      
      expect(mockGtag).toHaveBeenCalledWith('consent', 'deny', {
        'analytics_storage': false,
        'functionality_storage': false,
        'security_storage': false
      });
    });

    test('debe permitir opt-out', () => {
      AnalyticsService.optOut();
      
      expect(global.window[`ga-disable-G-TEST123`]).toBe(true);
    });
  });

  describe('Client ID', () => {
    test('debe obtener client ID', async () => {
      // Mock gtag para devolver client ID
      mockGtag.mockImplementation((command, measurementId, property, callback) => {
        if (command === 'get' && property === 'client_id') {
          callback('test-client-id-123');
        }
      });
      
      const clientId = await AnalyticsService.getClientId();
      
      expect(clientId).toBe('test-client-id-123');
      expect(mockGtag).toHaveBeenCalledWith('get', 'G-TEST123', 'client_id', expect.any(Function));
    });

    test('debe devolver ID por defecto sin measurement ID', async () => {
      delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
      
      const clientId = await AnalyticsService.getClientId();
      
      expect(clientId).toBe('no-ga-id');
    });
  });

  describe('Without GA Configuration', () => {
    beforeEach(() => {
      delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    });

    test('no debe trackear eventos sin configuration', () => {
      AnalyticsService.trackEcommerce.purchase('order_123', [], 0);
      AnalyticsService.trackUser.login();
      AnalyticsService.trackWellness.questionnaireStart();
      
      expect(mockGtag).not.toHaveBeenCalled();
    });
  });
});

module.exports = AnalyticsService;