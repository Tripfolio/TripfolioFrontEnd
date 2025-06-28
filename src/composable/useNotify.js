export function useNotify() {
  const notify = ({ title = '', text = '', type = 'info', duration = 3000 } = {}) => {
    window.$notify({
      group: 'foo',
      title,
      text,
      type,
      duration,
    });
  };

  return {
    notifySuccess: (text = '操作成功！') => notify({ title: '成功', text, type: 'success' }),
    notifyError: (text = '發生錯誤！') => notify({ title: '錯誤', text, type: 'error' }),
    notifyInfo: (text = '提示訊息') => notify({ title: '提示', text, type: 'info' }),
    notifyWarning: (text = '請注意！') => notify({ title: '警告', text, type: 'warning' }),
  };
}
