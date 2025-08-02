type FileDownloadArgs = { filePath: any; fileName: any };

const FileDownload = ({ filePath, fileName }: FileDownloadArgs) => {
	const handleDownload = () => {
		const newTab = window.open(filePath, '_blank');
		if (!newTab) {
			alert('Popup blocked! Please allow popups for this site.');
		}
	};
	return { trigger: handleDownload };
};

export default FileDownload;
