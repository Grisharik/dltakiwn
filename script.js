document.addEventListener('DOMContentLoaded', function() {
    const folderPath = 'takiwn'; // Путь к папке с файлами

    fetchFolderContents(folderPath)
        .then(files => {
            displayFiles(files);
        })
        .catch(error => {
            console.error('Error fetching folder contents:', error);
        });

    function fetchFolderContents(folderPath) {
        return fetch(`https://api.github.com/repos/${window.location.pathname.split('/')[1]}/contents/${folderPath}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch folder contents');
                }
                return response.json();
            })
            .then(data => {
                return data.filter(file => file.type === 'file'); // Отфильтровать только файлы
            });
    }

    function displayFiles(files) {
        const fileListElement = document.getElementById('fileList');

        files.forEach(file => {
            const fileSize = formatBytes(file.size);
            const fileModified = new Date(file.last_modified).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            const sizeCell = document.createElement('td');
            const modifiedCell = document.createElement('td');
            const downloadLink = document.createElement('a');

            downloadLink.href = file.download_url;
            downloadLink.textContent = file.name;
            downloadLink.setAttribute('download', ''); // Установите атрибут download для создания ссылки для скачивания

            nameCell.appendChild(downloadLink);
            sizeCell.textContent = fileSize;
            modifiedCell.textContent = fileModified;

            row.appendChild(nameCell);
            row.appendChild(sizeCell);
            row.appendChild(modifiedCell);

            fileListElement.appendChild(row);
        });
    }

    function formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
});
