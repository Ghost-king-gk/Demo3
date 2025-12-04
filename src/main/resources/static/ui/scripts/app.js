document.addEventListener('DOMContentLoaded', () =>    // DOM 加载完成后执行，确保HTML元素可用才去寻找按钮、输入框并绑定事件。
{
    const btnStatus = document.getElementById('btn-status');    // 状态检查,按钮
    const btnMemberList = document.getElementById('btn-members');  // 获取成员列表,按钮
    const btnMember = document.getElementById('btn-member');    // 获取指定成员,按钮
    const memberIdInput = document.getElementById('memberId');  // 成员ID输入框
    const main = document.getElementById('main');

    btnStatus.addEventListener('click', (event) => {
        playRippleEffect(btnStatus, event);
        // 获取成员列表 按钮点击事件处理函数
        // 点击函数之后，执行css中的ripple动画效果
        btnStatus.classList.remove('ripple');   // 若你使用 .ripple 作为“触发类”，否则用你实际的动画类名
        void btnStatus.offsetWidth;             // 强制回流，确保浏览器看到类被移除
        btnStatus.classList.add('ripple');
        fetchStatus();
    });
    btnMemberList.addEventListener('click', (event) => {
        playRippleEffect(btnMemberList, event);
        // 获取成员列表 按钮点击事件处理函数
        // 点击函数之后，执行css中的ripple动画效果
        btnMemberList.classList.remove('ripple');   // 若你使用 .ripple 作为“触发类”，否则用你实际的动画类名
        void btnMemberList.offsetWidth;             // 强制回流，确保浏览器看到类被移除
        btnMemberList.classList.add('ripple');
        fetchMemberList();
    });
    btnMember.addEventListener('click', (event) =>
        {
        playRippleEffect(btnMember, event);
        // 获取成员列表 按钮点击事件处理函数
        // 点击函数之后，执行css中的ripple动画效果
        btnMember.classList.remove('ripple');   // 若你使用 .ripple 作为“触发类”，否则用你实际的动画类名
        void btnMember.offsetWidth;             // 强制回流，确保浏览器看到类被移除
        btnMember.classList.add('ripple');

        const id = memberIdInput.value.trim();
        if (!id) {
            alert('请输入 ID');
            return;
        }
        fetchMember(id);
        }
    );

    function showLoading() {
        main.innerHTML = '<p class="loading">加载中…</p>';
    }
    function showError(err) {
        main.innerHTML = `<pre class="error">${escapeHtml(String(err))}</pre>`;
    }
    function escapeHtml(s) {
        return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }

    async function fetchStatus() {
        showLoading();
        try {
            const res = await fetch('/test');
            if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
            const text = await res.text();
            main.innerHTML = `<pre class="result">${escapeHtml(text)}</pre>`;
        } catch (e) {
            showError(e);
        }
    }

    async function fetchMemberList() {
        showLoading();
        try {
            const res = await fetch('/members');
            if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
            const json = await res.json();
            renderMembers(json);
        } catch (e) {
            showError(e);
        }
    }

    async function fetchMember(id) {
        showLoading();
        try {
            const res = await fetch('/member/' + encodeURIComponent(id));
            // 这行代码的意思是：获取指定 ID 的成员信息，获取到的数据格式为：{"present":true,"value":{...}}

            // 这里使用 encodeURIComponent 对 id 进行编码，防止特殊字符导致的 URL 问题。
            // fetch 是浏览器内置的用于发起 HTTP 请求的 API，返回一个 Promise 对象。
            // await 关键字用于等待 Promise 对象的解析结果。
            // const 是用于声明常量的关键字，表示 res 变量的值不会被重新赋值。Constance （缩写为Const） 是常量的意思。
            if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
            const json = await res.json();  // 使用JSON（）函数把res 转化为 JSON 格式
            renderMemberDetail(json);  // 渲染成员详情
        } catch (e) {
            showError(e);
        }
    }

    function renderMembers(list) {
        if (!Array.isArray(list) || list.length === 0) {
            main.innerHTML = '<p>无成员数据。</p>';
            return;
        }
        const rows = list.map(m => `
      <tr>
        <td>${escapeHtml(String(m.id))}</td>
        <td>${escapeHtml(m.name||'')}</td>
        <td>${escapeHtml(m.memberType||m.member_type||'')}</td>
        <td><button data-id="${escapeHtml(String(m.id))}" class="viewBtn">查看</button></td>
      </tr>`).join('');
        main.innerHTML = `
      <table class="table">
        <thead><tr><th>ID</th><th>姓名</th><th>类型</th><th>操作</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
        document.querySelectorAll('.viewBtn').forEach(b => b.addEventListener('click', e => {
            const id = e.currentTarget.getAttribute('data-id');
            fetchMember(id);
        }));
    }






    function renderMemberDetail(payload) {   //Js的函数定义，参数不需要写类型，payload 可以是任何类型
        // repository.findById 返回 Optional，后端如果直接返回可能是 {"present":true,"value":{...}} 或者后端已改为返回实体。
        // 这里做兼容：先尝试取 payload.value 或 payload
        const data = payload && payload.value ? payload.value : payload;  // 取 payload.value，如果没有则取 payload 本身
        // 含义是：如果 payload 存在且 payload.value 存在，则返回 payload.value，否则返回 payload 本身。
        // ？是 JavaScript 中的三元运算符，用于前面的根据条件表达式的真假来选择返回值。如果条件为真，返回冒号前的值；如果条件为假，返回冒号后的值。
        if (!data || Object.keys(data).length === 0) {   // Object.keys(data).length 获取对象 data 的属性数量。 如果为 0，则返回 true，表示对象为空。
            // 三个等号 === 是严格相等运算符，表示不仅值相等，而且类型也相等。
            // !逻辑运算符表示取非，即取反。 如果 data 为 null、undefined、0、false、NaN 或空字符串，则 !data 为 true。
            // || 是逻辑或运算符，表示只要有一个条件为真，就返回真。 这里的条件是 Object.keys(data).length === 0。
            main.innerHTML = '<p>未找到成员。</p>';
            // main.innerHTML 是用于设置或获取 HTML 元素的内容。 这里将 main 元素的内容设置为一个段落，显示“未找到成员。”的消息。
            return;
        }
        const html = Object.entries(data).map(([k,v]) =>
            // Object.entries(data) 是一个函数，用于将一个对象转换为一个数组，数组的元素是该对象中的属性名和属性值组成的数组。
            // 例如，{a:1, b:2} 会被转换为 [['a',1], ['b',2]]。
            // map 是数组下的一个方法，用于对数组的每个元素执行一个函数，并返回一个新的数组。
            /* 这里使用了解构赋值，将每个元素的属性名赋值给 k，属性值赋值给 v */
            // 例如，[['a',1], ['b',2]] 会被转换为 k='a', v=1 和 k='b', v=2。这个数组会被转换为两个表格行。
            `<tr>
                <th>${escapeHtml(k)}</th>   <td>${escapeHtml(String(v))}</td>
             </tr>` //tr 表示表格行，th 表示表头单元格，td 表示数据单元格。
            // 将每个属性名和属性值生成一个表格行，属性名放在表头单元格中，属性值放在数据单元格中。
            // 最后使用 join('') 将所有行连接成一个完整的表格字符串。 这里使用 join('') 是为了避免使用 + 连接字符串，因为 + 会导致性能问题。
        ).join('');
            // join 是数组下的一个方法，用于将数组的所有元素连接成一个字符串。 这里使用空字符串作为分隔符，表示不添加任何分隔符。
            // 最终生成的 html 变量是一个包含所有属性行的字符串，可以直接插入到表格中。
            // 最终将生成的表格字符串插入到 main 元素中，显示成员的详细信息。
            // 注意：这里没有对属性值进行特殊处理，直接转换为字符串并插入到表格中。如果属性值是对象或数组，可能需要进一步处理。
            /* 逻辑顺序：1. 获取成员数据，并判断是否为空。
                       2. 生成表格行。
                       3. 将所有行连接成一个完整的表格。
                       4. 将表格插入到 main 元素中。
                       5. 显示成员详细信息。 */
        main.innerHTML = `<table class="detail">${html}</table>`; // detail 是表格的类名，可以用于 CSS 样式。
    }

    function playRippleEffect(el,event) { //形参的作用： el：表示触发事件的元素，event：表示触发的事件对象
        let clientX, clientY; //定义变量 clientX 和 clientY，用于存储点击位置的坐标.
        //Let 是用于声明变量的关键字，表示 clientX 和 clientY 变量的值可以被重新赋值。
        //JS中 的变量声明不需要指定类型，变量可以是任何类型。
        if (event.touches && event.touches.length > 0) { //判断是否是触摸事件
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else { //否则是鼠标事件
            clientX = event.clientX;
            clientY = event.clientY;
        }

        const rect = el.getBoundingClientRect(); //获取元素的边界矩形信息
        const delta_X = clientX - rect.left; //计算点击位置相对于元素左上角的坐标
        const delta_Y = clientY - rect.top;
        // el.style 是用于设置或获取元素的内联样式。 这里使用 setProperty 方法设置 CSS 变量的值。
        // el = element 表示触发事件的元素。

        /**===========================================================================
         * 动态创建一个 span 元素，并设置其类名和位置，然后将其添加到触发事件的元素中。
         * 
         */


        const s = document.createElement('span'); //创建一个 span 元素
        s.className = 'ripple-effect'; //设置元素的类名为 ripple-effect
        s.style.left = delta_X + 'px'; //设置元素的位置为点击位置,相对于元素左上角
        s.style.top = delta_Y + 'px';
        el.appendChild(s); //将 span 元素添加到触发事件的元素中
        s.addEventListener('animationend', () => {  //animationend 事件表示动画结束时触发的事件
            el.removeChild(s); //动画结束后移除 span 元素
        });
    }

}
);