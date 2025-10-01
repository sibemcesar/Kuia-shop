console.log('🚀 Iniciando Kuia+ Shop...');
        document.getElementById('loadingStatus').textContent = 'Carregando Firebase...';

        // Firebase imports
        import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
        import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
        import { getDatabase, ref, onValue, push, set, remove, update } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js';
        import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where, orderBy } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

        console.log('✅ Firebase modules loaded');
        document.getElementById('loadingStatus').textContent = 'Conectando ao Firebase...';

        // Firebase Configuration
        const firebaseConfig = {
            apiKey: "AIzaSyArmhNnjraGaY017AP5uRcM8w0WWditrIs",
            authDomain: "kuia-shop.firebaseapp.com",
            projectId: "kuia-shop",
            storageBucket: "kuia-shop.appspot.com",
            messagingSenderId: "53786495493",
            appId: "1:53786495493:web:85fa67bd5de1d351b1ea6c",
            measurementId: "G-LTZ8VLN3LN"
        };

        // Initialize Firebase
        let app, auth, database, firestore;
        try {
            app = initializeApp(firebaseConfig);
            auth = getAuth(app);
            database = getDatabase(app);
            firestore = getFirestore(app);
            console.log('✅ Firebase initialized successfully');
            document.getElementById('loadingStatus').textContent = 'Firebase conectado!';
        } catch (error) {
            console.error('❌ Firebase initialization error:', error);
            document.getElementById('loadingStatus').textContent = 'Erro na conexão. Usando modo offline.';
        }

        // Dark mode setup
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        }
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            if (event.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        });

        // Global variables
        let currentUser = null;
        let isGuest = false;
        let cart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        let products = {};
        let categories = [];
        let favorites = [];
        let orders = {};
        let currentSection = 'home';
        let currentPriceFilter = 'all';
        let currentChatId = null;
        let chatMessages = [];
        let isFullChatMode = false;

        // API Key for image upload
        const apiKeyImgBB = 'e073e02267a1f0259cd69c562e780659';

        // DOM elements
        const loadingScreen = document.getElementById('loadingScreen');
        const loginScreen = document.getElementById('loginScreen');
        const mainApp = document.getElementById('mainApp');

        // Chat elements - both mini and full versions
        const chatContainer = document.getElementById('chatContainer');
        const chatMessages_dom = document.getElementById('chatMessages');
        const chatInputContainer = document.getElementById('chatInputContainer');
        const chatInput = document.getElementById('chatInput');
        const sendChatBtn = document.getElementById('sendChatBtn');
        const chatImageBtn = document.getElementById('chatImageBtn');
        const chatImageInput = document.getElementById('chatImageInput');
        const chatStatus = document.getElementById('chatStatus');
        const adminOnlineStatus = document.getElementById('adminOnlineStatus');

        // Full chat elements
        const chatFullContainer = document.getElementById('chatFullContainer');
        const chatFullMessages = document.getElementById('chatFullMessages');
        const chatFullInputContainer = document.getElementById('chatFullInputContainer');
        const chatFullInput = document.getElementById('chatFullInput');
        const sendChatFullBtn = document.getElementById('sendChatFullBtn');
        const chatFullImageBtn = document.getElementById('chatFullImageBtn');
        const chatFullImageInput = document.getElementById('chatFullImageInput');
        const chatFullStatus = document.getElementById('chatFullStatus');
        const adminOnlineFullStatus = document.getElementById('adminOnlineFullStatus');

        // Navigation elements
        const homeBtn = document.getElementById('homeBtn');
        const categoriesBtn = document.getElementById('categoriesBtn');
        const favoritesBtn = document.getElementById('favoritesBtn');
        const ordersBtn = document.getElementById('ordersBtn');
        const chatFullBtn = document.getElementById('chatFullBtn');

        // Footer navigation
        const footerHomeBtn = document.getElementById('footerHomeBtn');
        const footerCategoriesBtn = document.getElementById('footerCategoriesBtn');
        const footerFavoritesBtn = document.getElementById('footerFavoritesBtn');
        const footerOrdersBtn = document.getElementById('footerOrdersBtn');
        const footerChatBtn = document.getElementById('footerChatBtn');
        const footerCartBtn = document.getElementById('footerCartBtn');

        // Section elements
        const homeSection = document.getElementById('homeSection');
        const categoriesSection = document.getElementById('categoriesSection');
        const favoritesSection = document.getElementById('favoritesSection');
        const ordersSection = document.getElementById('ordersSection');
        const chatFullSection = document.getElementById('chatFullSection');
        const profileSection = document.getElementById('profileSection');

        // Other elements
        const loginOptions = document.getElementById('loginOptions');
        const emailLoginForm = document.getElementById('emailLoginForm');
        const emailRegisterForm = document.getElementById('emailRegisterForm');
        const guestBtn = document.getElementById('guestBtn');
        const googleLoginBtn = document.getElementById('googleLoginBtn');
        const showEmailLoginBtn = document.getElementById('showEmailLoginBtn');
        const backToOptionsBtn = document.getElementById('backToOptionsBtn');
        const showRegisterBtn = document.getElementById('showRegisterBtn');
        const backToLoginBtn = document.getElementById('backToLoginBtn');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userMenu = document.getElementById('userMenu');
        const userMenuContent = document.getElementById('userMenuContent');

        const cartBtn = document.getElementById('cartBtn');
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        const closeCartBtn = document.getElementById('closeCartBtn');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const cartCount = document.getElementById('cartCount');
        const footerCartCount = document.getElementById('footerCartCount');
        const checkoutBtn = document.getElementById('checkoutBtn');

        const productsGrid = document.getElementById('productsGrid');
        const categoriesGrid = document.getElementById('categoriesGrid');
        const favoritesGrid = document.getElementById('favoritesGrid');
        const searchInput = document.getElementById('searchInput');
        const mobileSearchInput = document.getElementById('mobileSearchInput');

        const checkoutModal = document.getElementById('checkoutModal');
        const loginRequiredMessage = document.getElementById('loginRequiredMessage');
        const checkoutLoginBtn = document.getElementById('checkoutLoginBtn');
        const checkoutRegisterBtn = document.getElementById('checkoutRegisterBtn');
        const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
        const cancelCheckoutBtn = document.getElementById('cancelCheckoutBtn');
        const checkoutForm = document.getElementById('checkoutForm');
        const checkoutSummary = document.getElementById('checkoutSummary');
        const checkoutTotal = document.getElementById('checkoutTotal');

        const productDetailModal = document.getElementById('productDetailModal');
        const closeDetailModalBtn = document.getElementById('closeDetailModalBtn');
        const detailModalTitle = document.getElementById('detailModalTitle');
        const detailImage = document.getElementById('detailImage');
        const detailName = document.getElementById('detailName');
        const detailCategory = document.getElementById('detailCategory');
        const detailPrice = document.getElementById('detailPrice');
        const detailOldPrice = document.getElementById('detailOldPrice');
        const detailDiscount = document.getElementById('detailDiscount');
        const detailStock = document.getElementById('detailStock');
        const detailDescription = document.getElementById('detailDescription');
        const detailDescriptionContainer = document.getElementById('detailDescriptionContainer');
        const detailAddToCartBtn = document.getElementById('detailAddToCartBtn');
        const detailFavoriteBtn = document.getElementById('detailFavoriteBtn');
        const detailFavoriteIcon = document.getElementById('detailFavoriteIcon');

        // Enhanced chat functionality with image support
        function initializeChat() {
            if (!currentUser) return;

            // Listen for admin-initiated chats
            const userChatsRef = ref(database, `chats/users/${currentUser.uid}`);
            onValue(userChatsRef, (snapshot) => {
                const chatData = snapshot.val();
                if (chatData && chatData.active) {
                    currentChatId = chatData.chatId;
                    updateChatStatus(true);
                    loadChatMessages();
                } else {
                    currentChatId = null;
                    updateChatStatus(false);
                }
            });
        }

        function updateChatStatus(isActive) {
            if (isActive) {
                // Mini chat status
                chatStatus.innerHTML = `
                    <span class="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
                        <span class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        Chat ativo
                    </span>
                `;
                adminOnlineStatus.classList.remove('hidden');
                chatInputContainer.classList.remove('hidden');
                
                // Full chat status
                chatFullStatus.innerHTML = `
                    <span class="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
                        <span class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        Chat ativo
                    </span>
                `;
                adminOnlineFullStatus.classList.remove('hidden');
                chatFullInputContainer.classList.remove('hidden');
                
                // Show notification
                document.getElementById('chatNotification').classList.remove('hidden');
                document.getElementById('footerChatNotification').classList.remove('hidden');
                
                chatMessages_dom.innerHTML = `
                    <div class="text-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                        <div class="bg-green-50 dark:bg-green-900 rounded-lg p-3 border border-green-200 dark:border-green-700">
                            <p class="text-green-700 dark:text-green-400">✅ Chat iniciado pelo administrador</p>
                            <p class="text-xs mt-1">Você pode conversar agora sobre seus pedidos</p>
                        </div>
                    </div>
                `;
                
                chatFullMessages.innerHTML = chatMessages_dom.innerHTML;
            } else {
                // Mini chat status
                chatStatus.innerHTML = `
                    <span class="inline-flex items-center px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                        <span class="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                        Chat offline
                    </span>
                `;
                adminOnlineStatus.classList.add('hidden');
                chatInputContainer.classList.add('hidden');
                
                // Full chat status
                chatFullStatus.innerHTML = `
                    <span class="inline-flex items-center px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                        <span class="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                        Chat offline
                    </span>
                `;
                adminOnlineFullStatus.classList.add('hidden');
                chatFullInputContainer.classList.add('hidden');
                
                // Hide notification
                document.getElementById('chatNotification').classList.add('hidden');
                document.getElementById('footerChatNotification').classList.add('hidden');
                
                const offlineMessage = `
                    <div class="text-center text-gray-500 dark:text-gray-400 text-sm">
                        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <p class="mb-2">💬 Chat de Suporte</p>
                            <p class="text-xs">O administrador irá iniciar o chat quando necessário para confirmar detalhes dos seus pedidos</p>
                            <div class="mt-3 flex items-center justify-center">
                                <span class="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                                <span class="text-xs">Aguardando...</span>
                            </div>
                        </div>
                    </div>
                `;
                
                chatMessages_dom.innerHTML = offlineMessage;
                chatFullMessages.innerHTML = offlineMessage;
            }
        }

        function loadChatMessages() {
            if (!currentChatId) return;

            const messagesRef = ref(database, `chats/messages/${currentChatId}`);
            onValue(messagesRef, (snapshot) => {
                const messages = snapshot.val() || {};
                const messagesList = Object.entries(messages)
                    .map(([id, msg]) => ({ id, ...msg }))
                    .sort((a, b) => a.timestamp - b.timestamp);

                displayChatMessages(messagesList);
            });
        }

        function displayChatMessages(messages) {
            if (messages.length === 0) {
                const initialMessage = `
                    <div class="text-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                        <div class="bg-green-50 dark:bg-green-900 rounded-lg p-3 border border-green-200 dark:border-green-700">
                            <p class="text-green-700 dark:text-green-400">✅ Chat iniciado pelo administrador</p>
                            <p class="text-xs mt-1">Digite sua primeira mensagem abaixo</p>
                        </div>
                    </div>
                `;
                chatMessages_dom.innerHTML = initialMessage;
                chatFullMessages.innerHTML = initialMessage;
                return;
            }

            const messagesHTML = messages.map(msg => {
                const isUser = msg.senderId === currentUser.uid;
                let messageContent = '';
                
                if (msg.type === 'image') {
                    messageContent = `
                        <img src="${msg.imageUrl}" alt="Imagem" class="max-w-full h-auto rounded-lg cursor-pointer" 
                             onclick="window.open('${msg.imageUrl}', '_blank')">
                        ${msg.text ? `<p class="text-sm mt-2">${msg.text}</p>` : ''}
                    `;
                } else {
                    messageContent = `<p class="text-sm">${msg.text}</p>`;
                }
                
                return `
                    <div class="flex ${isUser ? 'justify-end' : 'justify-start'} mb-3">
                        <div class="${isUser ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'} 
                                    rounded-lg px-3 py-2 max-w-xs lg:max-w-md">
                            ${messageContent}
                            <p class="${isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'} text-xs mt-1">
                                ${new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                `;
            }).join('');

            // Update both mini and full chat
            chatMessages_dom.innerHTML = messagesHTML;
            chatFullMessages.innerHTML = messagesHTML;

            // Scroll to bottom
            chatContainer.scrollTop = chatContainer.scrollHeight;
            chatFullContainer.scrollTop = chatFullContainer.scrollHeight;
        }

        async function sendChatMessage(messageText = null, imageUrl = null) {
            if (!currentChatId || (!messageText && !imageUrl)) return;

            try {
                const messageData = {
                    senderId: currentUser.uid,
                    senderName: currentUser.displayName || currentUser.email,
                    timestamp: Date.now(),
                    read: false
                };

                if (imageUrl) {
                    messageData.type = 'image';
                    messageData.imageUrl = imageUrl;
                    messageData.text = messageText || '';
                } else {
                    messageData.type = 'text';
                    messageData.text = messageText;
                }

                await push(ref(database, `chats/messages/${currentChatId}`), messageData);
            } catch (error) {
                console.error('Error sending message:', error);
                showCustomAlert('Erro ao enviar mensagem. Tente novamente.');
            }
        }

        // Chat image upload handlers for both mini and full chat
        function setupChatImageHandlers() {
            // Mini chat
            chatImageBtn.addEventListener('click', () => {
                chatImageInput.click();
            });

            chatImageInput.addEventListener('change', async (e) => {
                await handleImageUpload(e, chatImageBtn, 'mini');
            });

            // Full chat
            chatFullImageBtn.addEventListener('click', () => {
                chatFullImageInput.click();
            });

            chatFullImageInput.addEventListener('change', async (e) => {
                await handleImageUpload(e, chatFullImageBtn, 'full');
            });

            async function handleImageUpload(e, btnElement, mode) {
                const file = e.target.files[0];
                if (!file) return;

                // Show loading state
                btnElement.innerHTML = '⏳';
                btnElement.disabled = true;

                try {
                    const formData = new FormData();
                    formData.append('image', file);

                    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKeyImgBB}`, {
                        method: 'POST',
                        body: formData
                    });

                    const result = await response.json();
                    if (result.success) {
                        await sendChatMessage(null, result.data.url);
                    } else {
                        showCustomAlert('Erro ao fazer upload da imagem.');
                    }
                } catch (error) {
                    console.error('Image upload error:', error);
                    showCustomAlert('Erro ao fazer upload da imagem.');
                } finally {
                    // Reset button state
                    btnElement.innerHTML = '📷';
                    btnElement.disabled = false;
                    if (mode === 'mini') {
                        chatImageInput.value = '';
                    } else {
                        chatFullImageInput.value = '';
                    }
                }
            }
        }

        // Chat event handlers
        function setupChatEventHandlers() {
            // Mini chat handlers
            sendChatBtn.addEventListener('click', () => {
                const messageText = chatInput.value.trim();
                if (messageText) {
                    sendChatMessage(messageText);
                    chatInput.value = '';
                }
            });

            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const messageText = chatInput.value.trim();
                    if (messageText) {
                        sendChatMessage(messageText);
                        chatInput.value = '';
                    }
                }
            });

            // Full chat handlers
            sendChatFullBtn.addEventListener('click', () => {
                const messageText = chatFullInput.value.trim();
                if (messageText) {
                    sendChatMessage(messageText);
                    chatFullInput.value = '';
                }
            });

            chatFullInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const messageText = chatFullInput.value.trim();
                    if (messageText) {
                        sendChatMessage(messageText);
                        chatFullInput.value = '';
                    }
                }
            });

            // Open full chat button
            document.getElementById('openFullChatBtn').addEventListener('click', () => {
                showSection('chatFull');
            });
        }

        // Load orders for the user
        function loadUserOrders() {
            if (!currentUser) return;
            
            const ordersRef = ref(database, 'orders');
            onValue(ordersRef, (snapshot) => {
                const allOrders = snapshot.val() || {};
                const userOrders_array = Object.entries(allOrders)
                    .filter(([id, order]) => order.customer && order.customer.userId === currentUser.uid)
                    .map(([id, order]) => ({ id, ...order }))
                    .sort((a, b) => b.createdAt - a.createdAt);
                
                orders = userOrders_array.reduce((acc, order) => {
                    acc[order.id] = order;
                    return acc;
                }, {});
                
                console.log('User orders loaded:', userOrders_array.length);
                displayUserOrders(userOrders_array);
                displayOrdersInGrid(userOrders_array);
            });
        }

        function displayUserOrders(userOrders_array) {
            const userOrders = document.getElementById('userOrders');
            
            if (userOrders_array.length === 0) {
                userOrders.innerHTML = `
                    <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                        <div class="text-4xl mb-4">📦</div>
                        <p>Você ainda não fez nenhum pedido</p>
                    </div>
                `;
            } else {
                // Show only the latest 3 orders in profile
                const recentOrders = userOrders_array.slice(0, 3);
                userOrders.innerHTML = recentOrders.map(order => {
                    const statusColor = getOrderStatusColor(order.status);
                    const statusText = getOrderStatusText(order.status);
                    
                    return `
                        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                            <div class="flex justify-between items-start mb-2">
                                <span class="font-medium text-gray-800 dark:text-gray-200">Pedido #${order.id.slice(-6)}</span>
                                <span class="text-sm px-2 py-1 rounded ${statusColor}">
                                    ${statusText}
                                </span>
                            </div>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                ${order.items.length} item(s) • ${formatPrice(order.total)}
                            </p>
                            <div class="text-xs text-gray-500 dark:text-gray-500 mb-2">
                                ${new Date(order.createdAt).toLocaleDateString('pt-BR')} às ${new Date(order.createdAt).toLocaleTimeString('pt-BR')}
                            </div>
                            ${order.status === 'pending' ? 
                                '<p class="text-xs text-blue-600 dark:text-blue-400">⏳ Aguardando aprovação do administrador</p>' :
                                order.status === 'approved' ? 
                                '<p class="text-xs text-green-600 dark:text-green-400">✅ Pedido aprovado! Entraremos em contato em breve</p>' :
                                '<p class="text-xs text-red-600 dark:text-red-400">❌ Pedido rejeitado. Entre em contato conosco para mais informações</p>'
                            }
                        </div>
                    `;
                }).join('');
            }
        }

        function displayOrdersInGrid(userOrders_array) {
            const ordersGrid = document.getElementById('ordersGrid');
            
            if (userOrders_array.length === 0) {
                ordersGrid.innerHTML = `
                    <div class="text-center py-12">
                        <div class="text-4xl mb-4">📦</div>
                        <p class="text-gray-500 dark:text-gray-400">Você ainda não fez nenhum pedido</p>
                        <button onclick="showSection('home')" class="mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                            🛒 Fazer Primeiro Pedido
                        </button>
                    </div>
                `;
            } else {
                ordersGrid.innerHTML = userOrders_array.map(order => {
                    const statusColor = getOrderStatusColor(order.status);
                    const statusText = getOrderStatusText(order.status);
                    
                    return `
                        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Pedido #${order.id.slice(-6)}</h3>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">${new Date(order.createdAt).toLocaleString('pt-BR')}</p>
                                </div>
                                <span class="px-3 py-1 rounded-full text-sm font-medium ${statusColor}">
                                    ${statusText}
                                </span>
                            </div>
                            
                            <div class="space-y-3 mb-4">
                                <div>
                                    <h4 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Itens (${order.items.length})</h4>
                                    <div class="space-y-1">
                                        ${order.items.slice(0, 3).map(item => `
                                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                                ${item.quantity}x ${item.name} - ${formatPrice(item.price)}
                                            </p>
                                        `).join('')}
                                        ${order.items.length > 3 ? `<p class="text-sm text-gray-500 dark:text-gray-500">+${order.items.length - 3} mais...</p>` : ''}
                                    </div>
                                </div>
                                
                                <div class="pt-2 border-t border-gray-200 dark:border-gray-600">
                                    <div class="flex justify-between items-center">
                                        <span class="font-semibold text-gray-800 dark:text-gray-200">Total:</span>
                                        <span class="text-lg font-bold text-primary">${formatPrice(order.total)}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="flex justify-between items-center text-sm">
                                ${order.status === 'pending' ? 
                                    '<p class="text-blue-600 dark:text-blue-400">⏳ Aguardando aprovação</p>' :
                                    order.status === 'approved' ? 
                                    '<p class="text-green-600 dark:text-green-400">✅ Pedido aprovado</p>' :
                                    '<p class="text-red-600 dark:text-red-400">❌ Pedido rejeitado</p>'
                                }
                                <span class="text-gray-500 dark:text-gray-500">
                                    ${new Date(order.createdAt).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        function getOrderStatusColor(status) {
            switch (status) {
                case 'pending':
                    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
                case 'approved':
                    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
                case 'rejected':
                    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
                default:
                    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
            }
        }

        function getOrderStatusText(status) {
            switch (status) {
                case 'pending':
                    return 'Pendente';
                case 'approved':
                    return 'Aprovado';
                case 'rejected':
                    return 'Rejeitado';
                default:
                    return 'Desconhecido';
            }
        }

        // Enhanced navigation
        function showSection(section) {
            currentSection = section;
            
            // Hide all sections
            homeSection.classList.add('hidden');
            categoriesSection.classList.add('hidden');
            favoritesSection.classList.add('hidden');
            ordersSection.classList.add('hidden');
            chatFullSection.classList.add('hidden');
            profileSection.classList.add('hidden');
            
            // Update navigation buttons
            document.querySelectorAll('.nav-btn, .footer-nav-btn').forEach(btn => {
                btn.classList.remove('text-primary');
                btn.classList.add('text-gray-700', 'dark:text-gray-300');
            });
            
            // Show selected section and update nav
            switch (section) {
                case 'home':
                    homeSection.classList.remove('hidden');
                    homeBtn?.classList.add('text-primary');
                    footerHomeBtn.classList.add('text-primary');
                    break;
                case 'categories':
                    categoriesSection.classList.remove('hidden');
                    categoriesBtn?.classList.add('text-primary');
                    footerCategoriesBtn.classList.add('text-primary');
                    break;
                case 'favorites':
                    favoritesSection.classList.remove('hidden');
                    favoritesBtn?.classList.add('text-primary');
                    footerFavoritesBtn.classList.add('text-primary');
                    renderFavorites();
                    break;
                case 'orders':
                    ordersSection.classList.remove('hidden');
                    ordersBtn?.classList.add('text-primary');
                    footerOrdersBtn.classList.add('text-primary');
                    if (currentUser && !isGuest) {
                        loadUserOrders();
                    } else {
                        document.getElementById('ordersGrid').innerHTML = `
                            <div class="text-center py-12">
                                <div class="text-4xl mb-4">🔑</div>
                                <p class="text-gray-500 dark:text-gray-400">Faça login para ver seus pedidos</p>
                                <button onclick="showLoginScreen()" class="mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                                    Fazer Login
                                </button>
                            </div>
                        `;
                    }
                    break;
                case 'chatFull':
                    chatFullSection.classList.remove('hidden');
                    chatFullBtn?.classList.add('text-primary');
                    footerChatBtn.classList.add('text-primary');
                    if (currentUser && !isGuest) {
                        isFullChatMode = true;
                    } else {
                        chatFullMessages.innerHTML = `
                            <div class="text-center text-gray-500 dark:text-gray-400 py-12">
                                <div class="text-4xl mb-4">🔑</div>
                                <p>Faça login para usar o chat</p>
                                <button onclick="showLoginScreen()" class="mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                                    Fazer Login
                                </button>
                            </div>
                        `;
                    }
                    break;
                case 'profile':
                    profileSection.classList.remove('hidden');
                    if (currentUser && !isGuest) {
                        loadUserProfile();
                    } else {
                        // Show content for guest users or not logged in
                        document.getElementById('profileAvatar').src = 'https://via.placeholder.com/64?text=👤';
                        document.getElementById('profileName').textContent = isGuest ? 'Visitante' : 'Usuário';
                        document.getElementById('profileEmail').textContent = isGuest ? 'Navegando como visitante' : 'Faça login para ver seu perfil';
                        document.getElementById('userOrders').innerHTML = `
                            <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                                <div class="text-4xl mb-4">🔑</div>
                                <p>${isGuest ? 'Faça login para ver seus pedidos e gerenciar seu perfil' : 'Faça login para ver seus pedidos'}</p>
                                <button onclick="showLoginScreen()" class="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
                                    Fazer Login
                                </button>
                            </div>
                        `;
                    }
                    break;
            }
        }

        // Continue with the rest of the JavaScript code (authentication, product management, etc.)
        // The rest remains the same as the previous implementation...

        // Authentication event listeners
        guestBtn.addEventListener('click', () => {
            isGuest = true;
            currentUser = null;
            updateUserUI();
            showMainApp();
            loadData();
            updateCartUI();
        });

        googleLoginBtn.addEventListener('click', async () => {
            try {
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                
                // Save user profile to Firestore if it doesn't exist
                const userDoc = await getDoc(doc(firestore, 'users', user.uid));
                if (!userDoc.exists()) {
                    await setDoc(doc(firestore, 'users', user.uid), {
                        name: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                        createdAt: new Date(),
                        isActive: true
                    });
                }

                // Save to Realtime Database
                await set(ref(database, `users/${user.uid}`), {
                    name: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    createdAt: Date.now(),
                    isActive: true
                });

                // Check if user is admin and set admin status
                if (user.email === 'sibemcesar@gmail.com') {
                    const adminDoc = await getDoc(doc(firestore, 'admins', user.uid));
                    if (!adminDoc.exists()) {
                        await setDoc(doc(firestore, 'admins', user.uid), {
                            email: user.email,
                            role: 'super_admin',
                            createdAt: new Date()
                        });
                        
                        // Also set in Realtime Database
                        await set(ref(database, `admins/${user.uid}`), {
                            email: user.email,
                            role: 'super_admin',
                            createdAt: Date.now()
                        });
                    }
                }
                
                console.log('Google login successful:', user.email);
                
            } catch (error) {
                console.error('Login error:', error);
                showCustomAlert('Erro no login: ' + error.message);
            }
        });

        showEmailLoginBtn.addEventListener('click', () => {
            loginOptions.classList.add('hidden');
            emailLoginForm.classList.remove('hidden');
        });

        backToOptionsBtn.addEventListener('click', () => {
            emailLoginForm.classList.add('hidden');
            loginOptions.classList.remove('hidden');
        });

        showRegisterBtn.addEventListener('click', () => {
            emailLoginForm.classList.add('hidden');
            emailRegisterForm.classList.remove('hidden');
        });

        backToLoginBtn.addEventListener('click', () => {
            emailRegisterForm.classList.add('hidden');
            emailLoginForm.classList.remove('hidden');
        });

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            try {
                await signInWithEmailAndPassword(auth, email, password);
            } catch (error) {
                console.error('Login error:', error);
                showCustomAlert('Erro no login: ' + error.message);
            }
        });

        // Profile picture upload functionality
        const profilePictureInput = document.getElementById('profilePicture');
        const previewAvatar = document.getElementById('previewAvatar');
        let uploadedPhotoURL = null;

        profilePictureInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Show preview
            const reader = new FileReader();
            reader.onload = (e) => {
                previewAvatar.src = e.target.result;
            };
            reader.readAsDataURL(file);

            // Upload to ImgBB
            try {
                const formData = new FormData();
                formData.append('image', file);

                const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKeyImgBB}`, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                if (result.success) {
                    uploadedPhotoURL = result.data.url;
                    console.log('Image uploaded successfully:', uploadedPhotoURL);
                } else {
                    showCustomAlert('Erro ao fazer upload da imagem.');
                }
            } catch (error) {
                console.error('Image upload error:', error);
                showCustomAlert('Erro ao fazer upload da imagem.');
            }
        });

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            
            // Show loading state
            const registerBtnText = document.getElementById('registerBtnText');
            const registerBtnLoader = document.getElementById('registerBtnLoader');
            const registerSubmitBtn = document.getElementById('registerSubmitBtn');
            
            registerBtnText.classList.add('hidden');
            registerBtnLoader.classList.remove('hidden');
            registerSubmitBtn.disabled = true;
            
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                // Update profile with name and photo
                await updateProfile(user, { 
                    displayName: name,
                    photoURL: uploadedPhotoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=5D5CDE&color=fff&size=200`
                });
                
                // Save user profile to Firestore
                await setDoc(doc(firestore, 'users', user.uid), {
                    name: name,
                    email: email,
                    photoURL: uploadedPhotoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=5D5CDE&color=fff&size=200`,
                    createdAt: new Date(),
                    isActive: true
                });

                // Save to Realtime Database
                await set(ref(database, `users/${user.uid}`), {
                    name: name,
                    email: email,
                    photoURL: uploadedPhotoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=5D5CDE&color=fff&size=200`,
                    createdAt: Date.now(),
                    isActive: true
                });

                // Check if user is admin and set admin status
                if (email === 'sibemcesar@gmail.com') {
                    await setDoc(doc(firestore, 'admins', user.uid), {
                        email: email,
                        role: 'super_admin',
                        createdAt: new Date()
                    });
                    
                    // Also set in Realtime Database
                    await set(ref(database, `admins/${user.uid}`), {
                        email: email,
                        role: 'super_admin',
                        createdAt: Date.now()
                    });
                }
                
                showCustomAlert('Conta criada com sucesso!');
                
            } catch (error) {
                console.error('Register error:', error);
                showCustomAlert('Erro no cadastro: ' + error.message);
            } finally {
                // Reset loading state
                registerBtnText.classList.remove('hidden');
                registerBtnLoader.classList.add('hidden');
                registerSubmitBtn.disabled = false;
            }
        });

        // Authentication state observer
        onAuthStateChanged(auth, (user) => {
            console.log('Auth state changed:', user);
            currentUser = user;
            isGuest = false;
            
            if (user) {
                // Merge guest cart with user cart if exists
                if (cart.length > 0) {
                    // Transfer guest cart items to user
                    localStorage.removeItem('guestCart');
                }
                
                updateUserUI();
                showMainApp();
                loadData();
                loadFavorites();
                loadUserOrders();
                updateCartUI();
                initializeChat();
                setupChatImageHandlers();
                setupChatEventHandlers();
            } else if (!isGuest) {
                showLoginScreen();
            }
        });

        function updateUserUI() {
            if (currentUser) {
                userAvatar.src = currentUser.photoURL || 'https://via.placeholder.com/32?text=' + (currentUser.displayName?.charAt(0) || '👤');
                userName.textContent = currentUser.displayName || currentUser.email;
                
                userMenuContent.innerHTML = `
                    <button id="viewProfileBtn" class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                        <span class="mr-2">👤</span>Meu Perfil
                    </button>
                    <button id="logoutBtn" class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg">
                        <span class="mr-2">🚪</span>Sair
                    </button>
                `;
                
                // Add event listeners
                document.getElementById('viewProfileBtn').addEventListener('click', () => {
                    showSection('profile');
                    userMenu.classList.add('hidden');
                });
                
                document.getElementById('logoutBtn').addEventListener('click', async () => {
                    try {
                        await signOut(auth);
                        cart = [];
                        favorites = [];
                        orders = {};
                        updateCartUI();
                    } catch (error) {
                        console.error('Logout error:', error);
                    }
                });
                
            } else if (isGuest) {
                userAvatar.src = 'https://via.placeholder.com/32?text=👤';
                userName.textContent = 'Visitante';
                
                userMenuContent.innerHTML = `
                    <button id="guestLoginBtn" class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <span class="mr-2">🔑</span>Fazer Login
                    </button>
                `;
                
                document.getElementById('guestLoginBtn').addEventListener('click', () => {
                    showLoginScreen();
                    userMenu.classList.add('hidden');
                });
            }
        }

        // User menu toggle
        userMenuBtn.addEventListener('click', () => {
            userMenu.classList.toggle('hidden');
        });

        // Close user menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!userMenuBtn.contains(e.target) && !userMenu.contains(e.target)) {
                userMenu.classList.add('hidden');
            }
        });

        // Cart functionality
        cartBtn.addEventListener('click', openCart);
        footerCartBtn.addEventListener('click', openCart);
        closeCartBtn.addEventListener('click', closeCart);
        cartOverlay.addEventListener('click', closeCart);

        function openCart() {
            cartSidebar.classList.remove('translate-x-full');
            cartOverlay.classList.remove('hidden');
        }

        function closeCart() {
            cartSidebar.classList.add('translate-x-full');
            cartOverlay.classList.add('hidden');
        }

        // Navigation
        homeBtn?.addEventListener('click', () => showSection('home'));
        categoriesBtn?.addEventListener('click', () => showSection('categories'));
        favoritesBtn?.addEventListener('click', () => showSection('favorites'));
        ordersBtn?.addEventListener('click', () => showSection('orders'));
        chatFullBtn?.addEventListener('click', () => showSection('chatFull'));
        
        footerHomeBtn.addEventListener('click', () => showSection('home'));
        footerCategoriesBtn.addEventListener('click', () => showSection('categories'));
        footerFavoritesBtn.addEventListener('click', () => showSection('favorites'));
        footerOrdersBtn.addEventListener('click', () => showSection('orders'));
        footerChatBtn.addEventListener('click', () => showSection('chatFull'));

        // View all orders button
        document.getElementById('viewAllOrdersBtn').addEventListener('click', () => {
            showSection('orders');
        });

        // Search functionality
        searchInput.addEventListener('input', filterProducts);
        mobileSearchInput.addEventListener('input', filterProducts);

        // Checkout
        checkoutBtn.addEventListener('click', openCheckout);
        closeCheckoutBtn.addEventListener('click', closeCheckout);
        cancelCheckoutBtn.addEventListener('click', closeCheckout);
        checkoutForm.addEventListener('submit', processOrder);

        checkoutLoginBtn.addEventListener('click', () => {
            closeCheckout();
            showLoginScreen();
        });

        checkoutRegisterBtn.addEventListener('click', () => {
            closeCheckout();
            showEmailLoginBtn.click();
            showRegisterBtn.click();
        });

        // Product detail modal
        closeDetailModalBtn.addEventListener('click', closeProductDetail);

        function openCheckout() {
            if (cart.length === 0) return;
            
            if (!currentUser && !isGuest) {
                showCustomAlert('Faça login para finalizar a compra.');
                return;
            }
            
            if (isGuest) {
                // Show login required message for guests
                loginRequiredMessage.classList.remove('hidden');
                checkoutForm.classList.add('hidden');
            } else {
                // Pre-fill name if user is logged in
                document.getElementById('customerName').value = currentUser.displayName || '';
                loginRequiredMessage.classList.add('hidden');
                checkoutForm.classList.remove('hidden');
            }
            
            updateCheckoutSummary();
            checkoutModal.classList.remove('hidden');
        }

        function closeCheckout() {
            checkoutModal.classList.add('hidden');
            checkoutForm.reset();
            loginRequiredMessage.classList.add('hidden');
            checkoutForm.classList.remove('hidden');
        }

        function updateCheckoutSummary() {
            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            checkoutSummary.innerHTML = cart.map(item => `
                <div class="flex justify-between text-sm">
                    <span>${item.name} (${item.quantity}x)</span>
                    <span>${formatPrice(item.price * item.quantity)}</span>
                </div>
            `).join('');
            
            checkoutTotal.textContent = formatPrice(totalPrice);
        }

        async function processOrder(e) {
            e.preventDefault();
            
            if (!currentUser) {
                showCustomAlert('Você precisa estar logado para finalizar a compra.');
                return;
            }
            
            const orderData = {
                customer: {
                    name: document.getElementById('customerName').value,
                    phone: document.getElementById('customerPhone').value,
                    location: document.getElementById('customerLocation').value,
                    message: document.getElementById('customerMessage').value,
                    email: currentUser.email,
                    userId: currentUser.uid
                },
                items: cart.map(item => ({
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                status: 'pending',
                createdAt: Date.now()
            };
            
            try {
                // Save to Realtime Database and get the generated key
                const newOrderRef = push(ref(database, 'orders'));
                await set(newOrderRef, orderData);
                
                // Use the same key for Firestore to keep them synchronized
                await setDoc(doc(firestore, 'orders', newOrderRef.key), orderData);
                
                // Clear cart and close modals
                cart = [];
                updateCartUI();
                closeCheckout();
                closeCart();
                
                showCustomAlert('Pedido realizado com sucesso! Em breve entraremos em contato.');
                
                // Refresh orders if on orders or profile page
                if (currentSection === 'orders' || currentSection === 'profile') {
                    loadUserOrders();
                }
            } catch (error) {
                console.error('Error processing order:', error);
                showCustomAlert('Erro ao processar pedido. Tente novamente.');
            }
        }

        // Load data from Firebase
        function loadData() {
            // Load products from Realtime Database
            const productsRef = ref(database, 'products');
            onValue(productsRef, (snapshot) => {
                products = snapshot.val() || {};
                console.log('Products loaded:', Object.keys(products).length);
                renderProducts();
                updateCategories();
            });
        }

        function loadFavorites() {
            if (currentUser) {
                const favoritesRef = ref(database, `favorites/${currentUser.uid}`);
                onValue(favoritesRef, (snapshot) => {
                    const favoritesData = snapshot.val() || {};
                    favorites = Object.keys(favoritesData);
                    console.log('Favorites loaded:', favorites.length);
                    renderFavorites();
                    // Update product grid to reflect favorite status
                    if (currentSection === 'home') {
                        renderProducts();
                    }
                });
            }
        }

        async function loadUserProfile() {
            if (!currentUser) return;
            
            try {
                // Load user profile
                const profileAvatar = document.getElementById('profileAvatar');
                const profileName = document.getElementById('profileName');
                const profileEmail = document.getElementById('profileEmail');
                
                profileAvatar.src = currentUser.photoURL || 'https://via.placeholder.com/64?text=' + (currentUser.displayName?.charAt(0) || '👤');
                profileName.textContent = currentUser.displayName || 'Usuário';
                profileEmail.textContent = currentUser.email;
                
                // User orders are loaded by loadUserOrders() function
                loadUserOrders();
                
            } catch (error) {
                console.error('Error loading user profile:', error);
                document.getElementById('userOrders').innerHTML = `
                    <div class="text-center py-8 text-red-500 dark:text-red-400">
                        <div class="text-4xl mb-4">❌</div>
                        <p>Erro ao carregar dados do perfil</p>
                    </div>
                `;
            }
        }

        function renderProducts() {
            const productsArray = Object.entries(products).map(([id, product]) => ({ id, ...product }));
            const searchTerm = (searchInput.value || mobileSearchInput.value || '').toLowerCase();
            const activeCategory = document.querySelector('.category-filter-btn.bg-primary')?.dataset.category || 'all';
            
            let filteredProducts = productsArray;
            
            // Apply search filter
            if (searchTerm) {
                filteredProducts = filteredProducts.filter(product => 
                    product.name.toLowerCase().includes(searchTerm) ||
                    product.description?.toLowerCase().includes(searchTerm) ||
                    product.category.toLowerCase().includes(searchTerm)
                );
            }
            
            // Apply category filter
            if (activeCategory !== 'all') {
                filteredProducts = filteredProducts.filter(product => product.category === activeCategory);
            }

            // Apply price filter
            if (currentPriceFilter !== 'all') {
                filteredProducts = filteredProducts.filter(product => {
                    const price = product.price;
                    switch (currentPriceFilter) {
                        case '0-1000':
                            return price <= 1000;
                        case '1000-5000':
                            return price > 1000 && price <= 5000;
                        case '5000-10000':
                            return price > 5000 && price <= 10000;
                        case '10000+':
                            return price > 10000;
                        default:
                            return true;
                    }
                });
            }

            if (filteredProducts.length === 0) {
                productsGrid.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <div class="text-4xl mb-4">🔍</div>
                        <p class="text-gray-500 dark:text-gray-400">Nenhum produto encontrado</p>
                    </div>
                `;
                return;
            }

            productsGrid.innerHTML = filteredProducts.map(product => {
                const hasDiscount = product.oldPrice && product.oldPrice > product.price;
                const discountPercent = hasDiscount ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
                const isFavorite = favorites.includes(product.id);
                
                return `
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                     onclick="showProductDetail('${product.id}')">
                    <div class="relative aspect-w-1 aspect-h-1 w-full h-40 sm:h-48 bg-gray-200 dark:bg-gray-700">
                        ${product.image ? 
                            `<img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">` :
                            `<div class="w-full h-full flex items-center justify-center">
                                <div class="text-2xl sm:text-3xl text-gray-400">🖼️</div>
                            </div>`
                        }
                        ${currentUser ? `
                            <button onclick="event.stopPropagation(); toggleFavorite('${product.id}')" 
                                    class="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow">
                                <span class="text-lg">${isFavorite ? '❤️' : '🤍'}</span>
                            </button>
                        ` : ''}
                        ${hasDiscount ? `
                            <div class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                                -${discountPercent}%
                            </div>
                        ` : ''}
                        ${product.stock === 0 ? `
                            <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <span class="text-white font-bold text-sm">Esgotado</span>
                            </div>
                        ` : ''}
                    </div>
                    <div class="p-3 sm:p-4">
                        <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-sm sm:text-base line-clamp-2">${product.name}</h3>
                        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 capitalize">${getCategoryName(product.category)}</p>
                        
                        <div class="flex items-center space-x-2 mb-2">
                            <span class="text-lg sm:text-xl font-bold text-primary">${formatPrice(product.price)}</span>
                            ${hasDiscount ? `<span class="text-sm text-gray-400 line-through">${formatPrice(product.oldPrice)}</span>` : ''}
                        </div>
                        
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-xs text-gray-500 dark:text-gray-400">
                                <span class="mr-1">📦</span>${product.stock} disponível
                            </span>
                            ${product.stock > 0 && product.stock <= 5 ? `
                                <span class="text-xs text-orange-500 font-medium">Últimas unidades!</span>
                            ` : ''}
                        </div>
                        
                        <button onclick="event.stopPropagation(); addToCart('${product.id}')" 
                                class="w-full text-sm sm:text-base bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}"
                                ${product.stock === 0 ? 'disabled' : ''}>
                            <span class="mr-1 sm:mr-2">🛒</span>${product.stock === 0 ? 'Sem Estoque' : 'Adicionar'}
                        </button>
                    </div>
                </div>
            `;
            }).join('');
        }

        function renderFavorites() {
            if (!currentUser) {
                favoritesGrid.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <div class="text-4xl mb-4">🔑</div>
                        <p class="text-gray-500 dark:text-gray-400">Faça login para ver seus favoritos</p>
                    </div>
                `;
                return;
            }

            if (favorites.length === 0) {
                favoritesGrid.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <div class="text-4xl mb-4">❤️</div>
                        <p class="text-gray-500 dark:text-gray-400">Você ainda não tem produtos favoritos</p>
                        <p class="text-sm text-gray-400 dark:text-gray-500 mt-2">Clique no coração dos produtos para adicioná-los aos favoritos</p>
                    </div>
                `;
                return;
            }

            const favoriteProducts = favorites
                .map(id => products[id] ? { id, ...products[id] } : null)
                .filter(p => p !== null);

            if (favoriteProducts.length === 0) {
                favoritesGrid.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <div class="text-4xl mb-4">❤️</div>
                        <p class="text-gray-500 dark:text-gray-400">Produtos favoritos não encontrados</p>
                    </div>
                `;
                return;
            }

            favoritesGrid.innerHTML = favoriteProducts.map(product => {
                const hasDiscount = product.oldPrice && product.oldPrice > product.price;
                const discountPercent = hasDiscount ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
                
                return `
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                     onclick="showProductDetail('${product.id}')">
                    <div class="relative aspect-w-1 aspect-h-1 w-full h-40 sm:h-48 bg-gray-200 dark:bg-gray-700">
                        ${product.image ? 
                            `<img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">` :
                            `<div class="w-full h-full flex items-center justify-center">
                                <div class="text-2xl sm:text-3xl text-gray-400">🖼️</div>
                            </div>`
                        }
                        <button onclick="event.stopPropagation(); toggleFavorite('${product.id}')" 
                                class="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow">
                            <span class="text-lg">❤️</span>
                        </button>
                        ${hasDiscount ? `
                            <div class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                                -${discountPercent}%
                            </div>
                        ` : ''}
                        ${product.stock === 0 ? `
                            <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <span class="text-white font-bold text-sm">Esgotado</span>
                            </div>
                        ` : ''}
                    </div>
                    <div class="p-3 sm:p-4">
                        <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-sm sm:text-base line-clamp-2">${product.name}</h3>
                        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 capitalize">${getCategoryName(product.category)}</p>
                        
                        <div class="flex items-center space-x-2 mb-2">
                            <span class="text-lg sm:text-xl font-bold text-primary">${formatPrice(product.price)}</span>
                            ${hasDiscount ? `<span class="text-sm text-gray-400 line-through">${formatPrice(product.oldPrice)}</span>` : ''}
                        </div>
                        
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-xs text-gray-500 dark:text-gray-400">
                                <span class="mr-1">📦</span>${product.stock} disponível
                            </span>
                            ${product.stock > 0 && product.stock <= 5 ? `
                                <span class="text-xs text-orange-500 font-medium">Últimas unidades!</span>
                            ` : ''}
                        </div>
                        
                        <button onclick="event.stopPropagation(); addToCart('${product.id}')" 
                                class="w-full text-sm sm:text-base bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}"
                                ${product.stock === 0 ? 'disabled' : ''}>
                            <span class="mr-1 sm:mr-2">🛒</span>${product.stock === 0 ? 'Sem Estoque' : 'Adicionar'}
                        </button>
                    </div>
                </div>
            `;
            }).join('');
        }

        function updateCategories() {
            const productCategories = [...new Set(Object.values(products).map(p => p.category))];
            categories = productCategories;
            
            // Update category filters
            const categoryFilters = document.getElementById('categoryFilters');
            if (categoryFilters) {
                categoryFilters.innerHTML = `
                    <button class="category-filter-btn bg-primary text-white px-4 py-2 rounded-full text-sm font-medium" data-category="all">
                        Todos
                    </button>
                    ${categories.map(category => `
                        <button class="category-filter-btn bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-full text-sm font-medium" data-category="${category}">
                            ${getCategoryName(category)}
                        </button>
                    `).join('')}
                `;
                
                // Add event listeners to category filter buttons
                document.querySelectorAll('.category-filter-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        document.querySelectorAll('.category-filter-btn').forEach(b => {
                            b.classList.remove('bg-primary', 'text-white');
                            b.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-300', 'dark:hover:bg-gray-600');
                        });
                        btn.classList.add('bg-primary', 'text-white');
                        btn.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-300', 'dark:hover:bg-gray-600');
                        renderProducts();
                    });
                });
            }

            // Add price filter event listeners
            document.querySelectorAll('.price-filter-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.price-filter-btn').forEach(b => {
                        b.classList.remove('bg-primary', 'text-white');
                        b.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-300', 'dark:hover:bg-gray-600');
                    });
                    btn.classList.add('bg-primary', 'text-white');
                    btn.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-300', 'dark:hover:bg-gray-600');
                    currentPriceFilter = btn.dataset.price;
                    renderProducts();
                });
            });
            
            renderCategories();
        }

        function renderCategories() {
            if (categories.length === 0) {
                categoriesGrid.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <div class="text-4xl mb-4">📂</div>
                        <p class="text-gray-500 dark:text-gray-400">Nenhuma categoria disponível</p>
                    </div>
                `;
                return;
            }

            categoriesGrid.innerHTML = categories.map(category => {
                const categoryProducts = Object.values(products).filter(p => p.category === category);
                return `
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                         onclick="filterByCategory('${category}')">
                        <div class="text-center">
                            <div class="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <div class="text-2xl text-primary">${getCategoryIcon(category)}</div>
                            </div>
                            <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">${getCategoryName(category)}</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">${categoryProducts.length} produtos</p>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Favorites functions
        window.toggleFavorite = async function(productId) {
            if (!currentUser) {
                showCustomAlert('Faça login para adicionar favoritos.');
                return;
            }

            try {
                const userFavoritesRef = ref(database, `favorites/${currentUser.uid}/${productId}`);
                
                if (favorites.includes(productId)) {
                    await remove(userFavoritesRef);
                    console.log('Removed from favorites:', productId);
                } else {
                    await set(userFavoritesRef, true);
                    console.log('Added to favorites:', productId);
                }
            } catch (error) {
                console.error('Error toggling favorite:', error);
                showCustomAlert('Erro ao atualizar favoritos.');
            }
        };

        // Cart functions
        window.addToCart = function(productId) {
            const product = products[productId];
            if (!product || product.stock === 0) return;
            
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                if (existingItem.quantity < product.stock) {
                    existingItem.quantity++;
                }
            } else {
                cart.push({ ...product, id: productId, quantity: 1 });
            }
            
            // Save cart for guests
            if (isGuest) {
                localStorage.setItem('guestCart', JSON.stringify(cart));
            }
            
            updateCartUI();
            showCustomAlert('Produto adicionado ao carrinho!');
        };

        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            
            if (isGuest) {
                localStorage.setItem('guestCart', JSON.stringify(cart));
            }
            
            updateCartUI();
        }

        function updateQuantity(productId, change) {
            const item = cart.find(item => item.id === productId);
            if (!item) return;
            
            const product = products[productId];
            const newQuantity = item.quantity + change;
            
            if (newQuantity <= 0) {
                removeFromCart(productId);
            } else if (newQuantity <= product.stock) {
                item.quantity = newQuantity;
                
                if (isGuest) {
                    localStorage.setItem('guestCart', JSON.stringify(cart));
                }
                
                updateCartUI();
            }
        }

        function updateCartUI() {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            cartCount.textContent = totalItems;
            footerCartCount.textContent = totalItems;
            cartTotal.textContent = formatPrice(totalPrice);
            checkoutBtn.disabled = cart.length === 0;
            
            // Update footer cart count visibility
            if (totalItems > 0) {
                footerCartCount.classList.remove('hidden');
            } else {
                footerCartCount.classList.add('hidden');
            }
            
            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="text-center py-12">
                        <div class="text-4xl mb-4">🛒</div>
                        <p class="text-gray-500 dark:text-gray-400">Seu carrinho está vazio</p>
                    </div>
                `;
            } else {
                cartItems.innerHTML = cart.map(item => `
                    <div class="flex items-center space-x-3 py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                        <div class="flex-shrink-0 w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded">
                            ${item.image ? 
                                `<img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover rounded">` :
                                `<div class="w-full h-full flex items-center justify-center">
                                    🖼️
                                </div>`
                            }
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">${item.name}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">${formatPrice(item.price)}</p>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button onclick="updateQuantity('${item.id}', -1)" class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs hover:bg-gray-300 dark:hover:bg-gray-500">
                                ➖
                            </button>
                            <span class="text-sm w-8 text-center">${item.quantity}</span>
                            <button onclick="updateQuantity('${item.id}', 1)" class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs hover:bg-gray-300 dark:hover:bg-gray-500">
                                ➕
                            </button>
                        </div>
                        <button onclick="removeFromCart('${item.id}')" class="text-red-500 hover:text-red-700">
                            🗑️
                        </button>
                    </div>
                `).join('');
            }
        }

        // Product detail functions
        window.showProductDetail = function(productId) {
            const product = products[productId];
            if (!product) return;
            
            detailModalTitle.textContent = 'Detalhes do Produto';
            detailName.textContent = product.name;
            detailCategory.textContent = getCategoryName(product.category);
            detailPrice.textContent = formatPrice(product.price);
            
            // Handle old price and discount
            if (product.oldPrice && product.oldPrice > product.price) {
                const discountPercent = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
                detailOldPrice.textContent = formatPrice(product.oldPrice);
                detailOldPrice.classList.remove('hidden');
                detailDiscount.textContent = `-${discountPercent}%`;
                detailDiscount.classList.remove('hidden');
            } else {
                detailOldPrice.classList.add('hidden');
                detailDiscount.classList.add('hidden');
            }
            
            // Handle stock
            if (product.stock > 0) {
                detailStock.innerHTML = `<span class="mr-2">✅</span>${product.stock} unidades em estoque`;
                detailAddToCartBtn.disabled = false;
                detailAddToCartBtn.innerHTML = '<span class="mr-2">🛒</span>Adicionar ao Carrinho';
            } else {
                detailStock.innerHTML = '<span class="mr-2">❌</span>Produto esgotado';
                detailAddToCartBtn.disabled = true;
                detailAddToCartBtn.innerHTML = '<span class="mr-2">🚫</span>Sem Estoque';
            }
            
            // Handle description
            if (product.description && product.description.trim()) {
                detailDescription.textContent = product.description;
                detailDescriptionContainer.classList.remove('hidden');
            } else {
                detailDescriptionContainer.classList.add('hidden');
            }
            
            // Handle image
            if (product.image) {
                detailImage.innerHTML = `<img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover rounded-lg">`;
            } else {
                detailImage.innerHTML = '<div class="text-4xl text-gray-400">🖼️</div>';
            }

            // Handle favorite button
            if (currentUser) {
                const isFavorite = favorites.includes(productId);
                detailFavoriteIcon.textContent = isFavorite ? '❤️' : '🤍';
                detailFavoriteBtn.onclick = () => toggleFavorite(productId);
                detailFavoriteBtn.style.display = 'block';
            } else {
                detailFavoriteBtn.style.display = 'none';
            }
            
            // Set up add to cart button
            detailAddToCartBtn.onclick = () => {
                if (product.stock > 0) {
                    addToCart(productId);
                    closeProductDetail();
                }
            };
            
            productDetailModal.classList.remove('hidden');
        };

        function closeProductDetail() {
            productDetailModal.classList.add('hidden');
        }

        window.filterByCategory = function(category) {
            showSection('home');
            
            // Update category filter
            document.querySelectorAll('.category-filter-btn').forEach(btn => {
                btn.classList.remove('bg-primary', 'text-white');
                btn.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-300', 'dark:hover:bg-gray-600');
            });
            
            const categoryBtn = document.querySelector(`.category-filter-btn[data-category="${category}"]`);
            if (categoryBtn) {
                categoryBtn.classList.add('bg-primary', 'text-white');
                categoryBtn.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-300', 'dark:hover:bg-gray-600');
            }
            
            renderProducts();
        };

        function filterProducts() {
            renderProducts();
        }

        // Utility functions
        function formatPrice(price) {
            return `${Math.round(price).toLocaleString('pt-AO')} Kz`;
        }

        function getCategoryName(category) {
            const categoryNames = {
                'eletronicos': 'Eletrônicos',
                'roupas': 'Roupas',
                'casa': 'Casa e Jardim',
                'livros': 'Livros',
                'esportes': 'Esportes',
                'beleza': 'Beleza',
                'acessorios': 'Acessórios & Joias',
                'calcados': 'Calçados',
                'alimentacao': 'Alimentação & Bebidas',
                'saude': 'Saúde & Bem-estar',
                'automotivo': 'Automotivo',
                'brinquedos': 'Brinquedos & Jogos',
                'musica': 'Música & Instrumentos',
                'arte': 'Arte & Artesanato',
                'pets': 'Pets',
                'servicos': 'Serviços'
            };
            return categoryNames[category] || category;
        }

        function getCategoryIcon(category) {
            const categoryIcons = {
                'eletronicos': '💻',
                'roupas': '👕',
                'casa': '🏠',
                'livros': '📚',
                'esportes': '⚽',
                'beleza': '💄',
                'acessorios': '💍',
                'calcados': '👟',
                'alimentacao': '🍔',
                'saude': '💊',
                'automotivo': '🚗',
                'brinquedos': '🧸',
                'musica': '🎸',
                'arte': '🎨',
                'pets': '🐶',
                'servicos': '🛠️'
            };
            return categoryIcons[category] || '🏷️';
        }

        function showMainApp() {
            loadingScreen.classList.add('hidden');
            loginScreen.classList.add('hidden');
            mainApp.classList.remove('hidden');
        }

        function showLoginScreen() {
            loadingScreen.classList.add('hidden');
            mainApp.classList.add('hidden');
            loginScreen.classList.remove('hidden');
            
            // Reset login forms
            loginOptions.classList.remove('hidden');
            emailLoginForm.classList.add('hidden');
            emailRegisterForm.classList.add('hidden');
        }

        // Custom alert function
        function showCustomAlert(message) {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
            modal.innerHTML = `
                <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
                    <p class="text-gray-700 dark:text-gray-300 mb-4">${message}</p>
                    <div class="flex justify-end">
                        <button class="px-4 py-2 bg-primary text-white hover:bg-primary-dark rounded" onclick="this.closest('.fixed').remove()">OK</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        // Make functions available globally
        window.updateQuantity = updateQuantity;
        window.removeFromCart = removeFromCart;
        window.showLoginScreen = showLoginScreen;
        window.showSection = showSection;

        // Initialize the app
        setTimeout(() => {
            // Check if user is already authenticated or continue as guest
            if (!currentUser && !isGuest) {
                showLoginScreen();
            }
        }, 2000);