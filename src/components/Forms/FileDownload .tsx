type FileDownloadArgs = { filePath: string; fileName: string };

const FileDownload = ({ filePath, fileName }: FileDownloadArgs) => {
	const handleDownload = async () => {
		try {
			// Fetch the file as a blob
			const response = await fetch(filePath);
			if (!response.ok) {
				throw new Error('File download failed!');
			}
			const blob = await response.blob();

			// Create a temporary anchor element
			const link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob); // Create a blob URL
			link.download = fileName; // Set the desired file name
			document.body.appendChild(link); // Append the link to the DOM
			link.click(); // Trigger the click event
			document.body.removeChild(link); // Clean up
		} catch (error) {
			console.error('Error while downloading the file:', error);
			alert('Failed to download the file. Please try again.');
		}
	};
	return { trigger: handleDownload };
};

export default FileDownload;
