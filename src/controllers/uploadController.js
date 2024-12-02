// 단일 파일 업로드
const uploadSingleFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        return res.status(200).json({ message: 'File uploaded successfully', data: req.file.path });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// 다중 파일 업로드
const uploadMultipleFiles = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        return res.status(200).json({ message: 'Files uploaded successfully', data: req.files.map(file => file.path) });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    uploadSingleFile,
    uploadMultipleFiles,
};
