# abc-resume

A modern, responsive resume builder application that helps you create professional A4 portrait resumes with ease. Built with React, Spring Boot, and MongoDB. This is frontend repository.

## 🚀 Features

- **Professional A4 Portrait Layout** - Generate print-ready resumes in standard A4 portrait format (210mm × 297mm)
- **Multiple Templates** - Choose from 3+ professional resume templates
- **Real-time Preview** - See changes as you type
- **Download as PDF** - Export your resume as a high-quality PDF
- **Cloud Storage** - Save and manage multiple resume versions
- **Responsive Design** - Works on desktop and mobile devices

## 📱 Demo

[Insert GIF or screenshot of the application]

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Spring Boot, Java
- **Database**: MongoDB
- **Storage**: Cloudinary (for image storage)
- **Authentication**: JWT
- **PDF Generation**: jsPDF, html2canvas

## 📦 Prerequisites

- Node.js (v16+)
- Java 17+
- MongoDB
- Cloudinary account (for image uploads)

## 🚀 Getting Started

### Frontend Setup

1. Clone the repository:
```
git clone [https://github.com/AadityaUoHyd/abc-resume.git](https://github.com/AadityaUoHyd/abc-resume.git)

cd abc-resume/abc-resume
```

2. Install dependencies:
```
npm install
```

3. Create a .env file in the root directory and add your environment variables:
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_RAZORPAY_KEY=your_razorpay_key
```

4. Start the development server:
```
npm run dev
```

5. Backend Setup
Navigate to the backend directory:
```
cd ../abc-resume-backend
```

Configure your application.properties with your MongoDB and Cloudinary credentials.

```
Run the Spring Boot application:
./mvnw spring-boot:run
```

✨ Features in Detail
### A4 Portrait Layout
- Professional A4 portrait format (210mm × 297mm)
- Print-ready PDF generation
- Download your resume in PDF format and can also mail directly to your email-id.
- Consistent rendering across devices

### Resume Templates
- Multiple professional designs
- Easy switching between templates
- Customizable color schemes

### Image Handling
- Profile picture upload with preview
- Automatic thumbnail generation
- Cloud storage integration

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🤝 Contributing
Contributions are welcome! Please read our Contributing Guidelines for details.

📧 Contact
For any queries, please contact your-email@example.com

✨ Happy 'ABC Resume' Building! ✨