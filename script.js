'use strict';

window.onload = function() {
    const sectionA1 = document.querySelector('.section-a1');
    const section1 = document.querySelector('.section-1'); // Thêm dòng này
    const img = new Image();
    img.src = 'images/0.jpg';
    let isExperienceSelected = false; // Biến kiểm tra trạng thái chọn trải bài
    let isFrameClicked = false; // Biến kiểm tra trạng thái khung hình đã được click
    let cardNames = {}; // Khai báo biến để lưu tên lá bài

    // Tìm phần tử để hiển thị tên lá bài trong section 1b-2
    const cardNameDisplay = document.querySelector('.section-1b-2');
    cardNameDisplay.style.color = 'white'; // Màu chữ
    cardNameDisplay.style.fontSize = '20px'; // Kích thước chữ
    cardNameDisplay.style.marginTop = '10px'; // Khoảng cách trên

    // Tải tên lá bài từ file JSON
    fetch('cardNames.json')
        .then(response => response.json())
        .then(data => {
            cardNames = data; // Lưu dữ liệu vào biến cardNames
        });

    img.onload = function() {
        setupFrames();
    };

    const setupFrames = () => {
        const imgWidth = img.width;
        const imgHeight = img.height; // Sử dụng chiều cao của 0.jpg

        // Cập nhật chiều cao cho section 1-a và section 1-b
        const section1A = document.querySelector('.section-1-a');
        const section1B = document.querySelector('.section-1-b');
        section1A.style.height = imgHeight + 'px';
        section1B.style.height = imgHeight + 'px';

        // Cập nhật chiều cao cho section 1
        const section1 = document.querySelector('.section-1');
        

        // Cập nhật chiều rộng cho khung hình S1
        const khungHinhS1 = document.querySelector('.khung-hinh-s1');
        khungHinhS1.style.width = imgWidth + 'px';
        khungHinhS1.style.height = imgHeight + 'px'; // Đặt chiều cao cho khung hình S1

        sectionA1.style.height = imgHeight + 20 + 'px';

        const totalWidth = 1280;
        const numberOfFrames = 78;
        const frameWidth = imgWidth;
        const overlapAmount = 0.3 * frameWidth;
        const gap = (totalWidth - (numberOfFrames * (frameWidth - overlapAmount))) / (numberOfFrames - 1);

        // Xóa khung hình cũ
        sectionA1.innerHTML = '';

        const frames = [];
        for (let i = 0; i < numberOfFrames; i++) {
            const frame = document.createElement('div');
            frame.className = 'frame';
            frame.style.width = frameWidth + 'px';
            frame.style.height = imgHeight + 'px'; // Đặt chiều cao cho mỗi khung hình
            frame.style.position = 'absolute';
            frame.style.left = `${(totalWidth - (numberOfFrames * (frameWidth - overlapAmount) + (numberOfFrames - 1) * gap)) / 2 + (i * (frameWidth - overlapAmount + gap))}px`;
            frame.style.backgroundImage = `url(${img.src})`;
            frame.style.backgroundSize = 'cover';

            // Thêm sự kiện click cho khung hình A
            frame.onclick = function() {
                if (!isExperienceSelected) {
                    showNotification("Hãy chọn cách trải bài."); // Thông báo khi chưa chọn trải bài
                } else if (isFrameClicked) {
                    showNotification("Hãy chọn chủ đề khác bạn muốn xem."); // Thông báo khi đã click khung hình
                } else {
                    const khungHinhS1 = document.querySelector('.khung-hinh-s1');
                    khungHinhS1.style.transition = 'transform 0.01s'; // Tốc độ xoay
                    const shouldFlip = Math.random() < 0.5; // 50% khả năng lật

                    // Chọn ngẫu nhiên hình ảnh từ 1.jpg đến 22.jpg
                    const randomCardIndex = Math.floor(Math.random() * 22) + 1;
                    const newImage = `images/${randomCardIndex}.jpg`;

                    setTimeout(() => {
                        khungHinhS1.style.backgroundImage = `url(${newImage})`;

                        // Hiển thị tên lá bài và tổng hợp thông tin
                        const orientation = shouldFlip ? "(ngược)" : "(xuôi)";
                        const cardName = cardNames[randomCardIndex];
                        cardNameDisplay.textContent = `${cardName} ${orientation}`;

                        // Tạo thông điệp tổng hợp
                        const topicName = document.querySelector('.topic-name').textContent; // Lấy tên chủ đề
                        const combinedMessage = `${cardName} ${orientation} theo "${topicName}" đối với bản thân, hoàn cảnh và thử thách có ý nghĩa là gì?`;

                        // Lưu thông điệp vào sessionStorage để sử dụng sau
                        sessionStorage.setItem('combinedMessage', combinedMessage);


                        // Giữ hình ở trạng thái lật ngược nếu đã được lật
                        if (shouldFlip) {
                            khungHinhS1.style.transform = 'rotate(180deg)'; // Lật hình theo chiều dọc
                        } else {
                            khungHinhS1.style.transform = 'rotate(0deg)'; // Giữ nguyên
                        }

                        // Tạo popup hình ảnh
                        const popup = document.createElement('div');
                        const popupImg = document.createElement('img');
                        popupImg.src = khungHinhS1.style.backgroundImage.slice(5, -2); // Lấy URL hình ảnh trong khung S1
                        popupImg.style.borderRadius = '10px';
                        popupImg.style.border = '2px solid white'; // Viền trắng
                        popupImg.style.width = imgWidth + 'px'; // Kích thước giống hình ảnh
                        popupImg.style.position = 'absolute';
                        popupImg.style.transition = 'transform 0.5s, opacity 0.5s'; // Thêm hiệu ứng biến đổi
                        document.body.appendChild(popup);
                        popup.appendChild(popupImg);

                        // Đặt vị trí popup vào giữa trang
                        popup.style.position = 'fixed';
                        popup.style.top = '50%';
                        popup.style.left = '50%';
                        popup.style.transform = 'translate(-50%, -50%)'; // Đưa popup về giữa

                        // Nếu khung hình bị xoay ngược, xoay popup tương tự
                        if (khungHinhS1.style.transform === 'rotate(180deg)') {
                            popupImg.style.transform = 'rotate(180deg)'; // Lật popup
                        }

                        // Hiệu ứng bay lên
                        setTimeout(() => {
                            popupImg.style.opacity = '1'; // Đảm bảo hiển thị

                            // Biến mất sau 3 giây
                            setTimeout(() => {
                                popupImg.style.transition = 'opacity 0.5s'; // Thay đổi thời gian biến mất
                                popupImg.style.opacity = '0'; // Biến mất
                            }, 3000); // Thời gian popup giữ nguyên
                        }, 10); // Thực hiện sau một khoảng thời gian ngắn

                        // Xóa popup sau 4 giây
                        setTimeout(() => {
                            document.body.removeChild(popup);
                        }, 4000); // Thời gian để xóa popup hoàn toàn
                    }, 10); // Thay đổi hình sau khi hết thời gian lật

                    isFrameClicked = true; // Đánh dấu khung hình đã được click
                }
            };

            sectionA1.appendChild(frame);
            frames.push(frame);
        }

        // Xử lý cho nút xào bài
        const shuffleButton = document.querySelector('.shuffle-button');
        shuffleButton.onclick = function() {
            const centerX = (totalWidth - frameWidth) / 2;

            frames.forEach((frame) => {
                frame.style.transition = 'transform 0.2s ease';
                frame.style.transform = `translateX(${centerX - parseFloat(frame.style.left)}px)`;
            });

            setTimeout(() => {
                frames.forEach((frame) => {
                    frame.style.transition = 'transform 0.2s ease';
                    frame.style.transform = '';
                });
            }, 200);
        };
    };

    const sectionB = document.querySelector('.section-b');
    sectionB.style.display = 'none'; // Ẩn section B ban đầu

    const topicButtons = document.querySelectorAll('.topic-button');
    topicButtons.forEach(button => {
        button.onclick = function() {
            const topicName = document.querySelector('.topic-name');
            topicName.textContent = this.textContent;

            // Reset trạng thái khi chọn chủ đề mới
            isExperienceSelected = false; // Reset trạng thái trải bài
            isFrameClicked = false; // Reset khung hình đã click
            cardNameDisplay.textContent = ''; // Xóa tên lá bài
            section1.style.display = 'none'; // Ẩn Section 1 khi chọn chủ đề mới

            // Đặt lại hình ảnh khung S1 về hình 0.jpg
            const khungHinhS1 = document.querySelector('.khung-hinh-s1');
            khungHinhS1.style.backgroundImage = `url(images/0.jpg)`;
            khungHinhS1.style.transform = 'rotate(0deg)'; // Đặt lại góc quay

            sectionB.style.display = 'block'; // Hiện section B
            setupFrames(); // Cập nhật lại khung hình S1

            // Reset các nút menu ở section B
            const topicButtonsB = document.querySelectorAll('.topic-button-b');
            topicButtonsB.forEach(btn => {
                btn.classList.remove('selected'); // Bỏ chọn tất cả nút
            });

            showNotification("Hãy chọn cách trải bài."); // Thông báo khi chọn chủ đề mới

            topicButtons.forEach(btn => {
                btn.classList.remove('selected');
            });
            this.classList.add('selected');

            // Ẩn section mean
            const sectionMean = document.querySelector('.section-mean');
            sectionMean.style.display = 'none'; // Ẩn section-mean
        };
    });

    // Xử lý cho các nút trong section B
    const topicButtonsB = document.querySelectorAll('.topic-button-b');
    topicButtonsB.forEach(button => {
        button.onclick = function() {
            // Đổi màu nút đã chọn
            topicButtonsB.forEach(btn => {
                btn.classList.remove('selected');
            });
            this.classList.add('selected');

            // Chỉ cho phép trải bài nếu nút "Trải bài 1 lá" được chọn
            isExperienceSelected = (this.textContent === "Trải bài 1 lá");

            if (isExperienceSelected) {
                console.log("Đã chọn trải bài 1 lá.");
                section1.style.display = 'block'; // Hiện Section 1
            } else {
                section1.style.display = 'none'; // Ẩn Section 1 nếu nút khác được chọn
            }

            // Thông báo khi chọn bất kỳ nút nào
            showNotification("Bạn hãy xào bài và chọn lá bài ngẫu nhiên.");
        };
    });

    // Hàm hiển thị thông báo
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = 'darkred'; // Màu nền đỏ đậm
        notification.style.color = 'white';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.border = '2px solid white'; // Viền trắng
        document.body.appendChild(notification);

        // Tắt thông báo sau 3 giây
        setTimeout(() => {
            notification.style.transition = 'opacity 0.5s';
            notification.style.opacity = '0'; // Biến mất
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500); // Xóa sau khi biến mất
        }, 3000); // Thời gian hiển thị
    }

    // Hàm gửi tin nhắn đến ChatGPT
    document.getElementById('sendMessage').onclick = async function() {
        const inputField = document.getElementById('chatInput');
        const userMessage = inputField.value;

        if (userMessage.trim() === '') return;

        // Hiển thị tin nhắn của người dùng
        addMessageToChat('Bạn: ' + userMessage);
        inputField.value = '';

        // Gửi yêu cầu đến API ChatGPT
        try {
            const response = await fetch('/api/chat', { // Đảm bảo endpoint phù hợp với server của bạn
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await response.json();
            const botMessage = data.choices[0].message.content;

            // Hiển thị phản hồi từ ChatGPT
            addMessageToChat('GPT: ' + botMessage);

            // Hiển thị phản hồi trong section-mean-2
            const sectionMean2 = document.querySelector('.section-mean-2');
            sectionMean2.style.backgroundColor = 'white'; // Nền chữ trắng
            sectionMean2.textContent = botMessage; // Hiển thị nội dung phản hồi
        } catch (error) {
            console.error('Error:', error);
            addMessageToChat('GPT: Đã xảy ra lỗi. Vui lòng thử lại sau.');
        }
    };

    // Hàm để thêm tin nhắn vào giao diện chat
    function addMessageToChat(message) {
        const messagesDiv = document.getElementById('messages');
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight; // Cuộn xuống dưới
    }

    // Xử lý cho nút "Xem Ý Nghĩa Của Lá Bài Bạn Chọn"
    const viewMeaningButton = document.querySelector('.view-meaning-button');
    const inputField = document.getElementById('chatInput'); // Trường nhập tin nhắn
    const sectionMean = document.querySelector('.section-mean');

    viewMeaningButton.onclick = function() {
        const khungHinhS1 = document.querySelector('.khung-hinh-s1');

        // Kiểm tra nếu đã chọn lá bài
        if (khungHinhS1.style.backgroundImage !== `url(images/0.jpg)`) {
            const cardName = cardNameDisplay.textContent.split(' ')[0]; // Lấy tên lá bài
            const orientation = khungHinhS1.style.transform === 'rotate(180deg)' ? '(ngược)' : '(xuôi)';
            const topicName = document.querySelector('.topic-name').textContent; // Lấy tên chủ đề

            // Tạo thông điệp tổng hợp
            const combinedMessage = `${cardNameDisplay.textContent} theo "${topicName}" đối với bản thân, hoàn cảnh và thử thách có ý nghĩa là gì?`;

            // Hiển thị section mean
            document.querySelector('.section-mean').style.display = 'block';

            // Tự động điền vào ô nhập tin nhắn
            inputField.value = combinedMessage; // Điền thông điệp vào ô nhập

            // Thay vì kích hoạt click, gọi hàm gửi tin nhắn trực tiếp
            sendChatMessage(combinedMessage);
        } else {
            showNotification("Bạn chưa chọn lá bài nào."); // Thông báo khi chưa chọn lá bài
        }
    };

    // Hàm gửi tin nhắn
    function sendChatMessage(message) {
        const messageInput = document.getElementById('chatInput');
        const sendMessageButton = document.getElementById('sendMessage');

        // Điền thông điệp vào ô nhập
        messageInput.value = message;

        // Gọi sự kiện gửi
        sendMessageButton.click(); 

        // Gọi hàm hiển thị phản hồi từ ChatGPT
        displayResponse(); // Hàm hiển thị nội dung phản hồi
    }

    // Hàm để hiển thị phản hồi từ ChatGPT
    function displayResponse() {
        const gptResponseElement = document.getElementById('gpt-response');

        // Tạo biến để lưu nội dung phản hồi thực tế
        let response = "Đã xảy ra lỗi. Vui lòng thử lại sau."; // Thông báo lỗi mặc định

        // Cập nhật nội dung phản hồi từ API (giả định bạn có hàm lấy phản hồi)
        fetch('/api/chat') // Thay thế với API thực tế của bạn
            .then(res => res.json())
            .then(data => {
                // Nếu có phản hồi từ ChatGPT, cập nhật response
                if (data && data.choices && data.choices.length > 0) {
                    response = data.choices[0].message.content;
                }
                // Cập nhật nội dung phản hồi
                gptResponseElement.innerHTML = response; // Cập nhật nội dung phản hồi

                // Hiển thị phản hồi trong section-mean-2
                const sectionMean2 = document.querySelector('.section-mean-2');
                sectionMean2.innerHTML = response; // Hiển thị nội dung phản hồi
                sectionMean2.style.display = 'block'; // Đảm bảo section hiển thị
            })
            .catch(error => {
                console.error('Error:', error);
                // Cập nhật nội dung phản hồi với thông báo lỗi
                gptResponseElement.innerHTML = response; // Cập nhật nội dung phản hồi

                // Hiển thị thông báo lỗi trong section-mean-2
                const sectionMean2 = document.querySelector('.section-mean-2');
                sectionMean2.innerHTML = response; // Hiển thị thông báo lỗi
                sectionMean2.style.display = 'block'; // Đảm bảo section hiển thị
            });
    }









};
