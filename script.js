// 获取左侧导航栏的所有列表项
const navItems = document.querySelectorAll('#nav li');
// 获取右侧内容区域
const contentDiv = document.getElementById('content');

let questions = [];
let userScore = 0;
let totalQuestions = 0;
let answeredQuestions = new Set();

// 遍历每个导航项，添加点击事件监听器
navItems.forEach((item) => {
  item.addEventListener('click', function () {
    const pageId = this.dataset.page;
    // 这里可以根据不同的pageId去获取对应页面内容，简单示例直接设置文本
    switch (pageId) {
      case 'page1':
        contentDiv.innerHTML = '<h1 class="page-title">第一章 JavaScript介绍</h1>'+
                                '<p class="start-content">JavaScript是世界上最受欢迎的编程语言之一，这是一种伟大的语言，可以成为你的第一个编程语言。</p>'+
                                '<p class="start-content">我们主要用JavaScript去创造：网站、web应用程序、服务器应用程序。</p>'+
                                '<p class="start-content">它基本上可以做任何事情。它非常流行，所以所有出现的新东西在某个时候都会有一些JavaScript集成。</p>'+
                                '<p class="start-content content-title">JavaScript是一种编程语言，它：</p>'+
                                '<ul class="start-content">'+
                                '<li><strong>高级</strong>：它提供了抽象，允许您忽略运行它的机器的细节。它使用垃圾收集器自动管理内存，因此您可以专注于代码，而不是像C这样的其他语言那样管理内存，并提供了许多结构，允许您处理功能非常强大的变量和对象</li>'+
                                '<li><strong>动态语言</strong>：与静态编程语言不同，动态语言在运行时执行静态语言在编译时所做的许多事情。这也有优缺点，它为我们提供了强大的特性，如动态类型、后期绑定、反射、函数式编程、对象运行时更改、闭包等等。如果你不知道这些事情，也不要担心——你会在课程结束时知道所有这些事情</li>'+
                                '<li><strong>动态类型</strong>：变量不强制执行类型。您可以将任何类型重新分配给一个变量，例如，将一个整数分配给一个包含字符串的变量</li>'+
                                '<li><strong>松散类型</strong>：与强类型不同，松散（或弱）类型语言不强制执行对象的类型，允许更多的灵活性，但拒绝了类型安全性和类型检查（类型Script——构建在JavaScript之上——提供的东西）</li>'+
                                '<li><strong>解释</strong>：它通常被称为解释语言，这意味着它在程序运行之前不需要编译阶段，而不是C、Java或Go。在实践中，出于性能原因，浏览器确实会在执行JavaScript之前编译它，但这对您来说是透明的：没有涉及到额外的步骤</li>'+
                                '<li><strong>多范式</strong>：该语言不强制执行任何特定的编程范式，例如，Java强制使用面向对象编程，或者C语言强制使用命令式编程。您可以使用面向对象的范例，使用原型和新的（如ES6中的）类语法来编写JavaScript。您可以用函数式编程风格编写JavaScript，以及它的第一个类函数，甚至是命令式风格（类似c语言）</li>'+
                                '</ul>'+
                                '<p class="start-content red">注意：JavaScript与Java无关，这是一个糟糕的名称选择，但我们必须接受它。</p>'+
                                '<h2 class="page-title-2">练习</h2>'+
                                '<p class="start-content"><strong>初次体验</strong>：在下面的代码编辑器中，已经给出一个简单的JavaScript程序。它会打印出“Hello World”。</p>'+
                                '<p class="start-content">你的任务是先将<em>Hello, World!</em>改成<em>Hello, JS!</em>，然后点击“更新预览”按钮，看看结果。</p>'+
                                '<p class="start-content">第二步，将script中的代码改为<em>alert("Hello, World!");</em>，看看有什么不同。（目前，你不必懂得这些内容，以后我们会逐一学习）</p>'+
                                '<p class="start-content">完成这些后，你可以进入到下一章的学习😊</p>'+
                                `<h1 class="page-title">代码编辑器</h1>
                                    <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
                                    <textarea id="html-code" placeholder=" " style="width: 80%; height: 300px; margin-bottom: 20px; padding: 10px; font-family: monospace; font-size: 16px; border: 1px solid #ccc; border-radius: 5px;"></textarea>

                                    <button id="preview-button" style="padding: 10px 20px; font-size: 16px; cursor: pointer; background-color: #4CAF50; color: white; border: none; border-radius: 5px;">更新预览</button>
                                    <div id="preview" style="width: 80%; height: 400px; border: 1px solid #ccc; border-radius: 5px; background-color: #f4f4f4; margin-top: 20px;"></div>
                                </div>`;
                                // 使用 setTimeout 确保在 DOM 更新后再设置默认值
        setTimeout(() => {
            const htmlCodeTextarea = document.getElementById('html-code');
            if (htmlCodeTextarea) {
              htmlCodeTextarea.value = `
              <!DOCTYPE html>
                <html lang="en">

                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                </head>

                <body>
                <script>
                    document.write("Hello, World!");
                </script>
                </body>

                </html>`;
              // 添加按钮点击事件
              document.getElementById('preview-button').addEventListener('click', function() {
                updatePreview();
              });

              // 自动显示预览
              updatePreview();
            }
          }, 50);
        break;
      case 'page2':
        contentDiv.innerHTML = '<h1 class="page-title">第二章 JavaScript发展历史</h1>'+
                                '<p class="start-content">你还记得初始页面的语言诞生时间轴吗？创建于JavaScript的1995年，它已经走了很长的路。</p>'+
                                '<p class="start-content">它是第一个由web浏览器支持的脚本语言，因此它获得了比任何其他语言的竞争优势，今天它仍然是我们唯一可以用于构建web应用程序的唯一脚本语言。</p>'+
                                '<p class="start-content">其他语言也存在，但所有的语言都必须编译成JavaScript——或者最近才编译成网络汇编，但这是另一回事了。</p>'+
                                '<p class="start-content">一开始，JavaScript并不像今天那样强大，它主要用于奇特的动画和当时被称为动态HTML的奇迹。</p>'+
                                '<p class="start-content">随着网络平台的需求（和持续需求）的不断增长，JavaScript也有责任不断增长，以适应世界上最广泛使用的生态系统之一的需求。</p>'+
                                '<p class="start-content">JavaScript现在也被广泛用于浏览器之外。在过去的几年中，Node.jse的兴起开启了后端开发，它曾经是Java、Ruby、Python、PHP和更传统的服务器端语言的领域。</p>'+
                                '<p class="start-content">JavaScript现在也是支持数据库和更多应用程序的语言，甚至可以开发嵌入式应用程序、移动应用程序、电视应用程序等等。最初是浏览器内的一种小语言，现在是世界上最流行的语言。</p>'+
                                '<p class="start-content">JavaScript的未来是光明的，它将继续发展，以适应不断变化的需求。</p>'+
                                '<h2 class="page-title-2">本章无练习，可以直接进入到下一章的学习✌</h2>'
                                ;
        break;
      case 'page3':
        contentDiv.innerHTML = '<h1 class="page-title">第三章 JavaScript的特点</h1>'+
                                '<p class="start-content">有时很难将JavaScript与它所使用的环境的特性分离开来。</p>'+
                                '<p class="start-content">例如，您在许多代码示例中可以找到的控制台.log（）行不是JavaScript。相反，它是在浏览器中提供给我们的庞大api库的一部分。同样地，在服务器上，有时很难将JavaScript语言特性与Node.js提供的api分离开来。</p>'+
                                '<p class="start-content">JavaScript的特性是：它是一个解释的、动态的、弱类型的、基于原型的、面向对象的语言。</p>'+
                                '<p class="start-content">React或Vue是否提供了一个特定的特性？或者是“普通的JavaScript”？</p>'+
                                '<p class="start-content">在这次学习中，我们谈论了JavaScript，一种语言，而不影响你的学习过程，并由外部生态系统提供。</p>'+
                                '<h2 class="page-title-2">本章无练习，可以直接进入到下一章的学习🥰，接下来就是正式开始学习了，加油✊</h2>'
                                ;
        break;
        case 'page4':
            totalQuestions = 0;
            userScore = 0;
            answeredQuestions.clear();

            questions = [
                {
                  id: 'q1',
                  text: '变量名"myVariable"和"myvariable"是不同的变量。',
                  options: [
                    { value: 'true', label: '对' },
                    { value: 'false', label: '错' }
                  ],
                  correctAnswer: 'true',
                  points: 1
                },
                {
                  id: 'q2',
                  text: 'JavaScript是区分大小写的语言。',
                  options: [
                    { value: 'true', label: '对' },
                    { value: 'false', label: '错' }
                  ],
                  correctAnswer: 'true',
                  points: 1
                },
                {
                  id: 'q3',
                  text: '在JavaScript中，空格和换行符对代码执行没有影响。',
                  options: [
                    { value: 'true', label: '对' },
                    { value: 'false', label: '错' }
                  ],
                  correctAnswer: 'true',
                  points: 1
                }
              ];

              totalQuestions = questions.reduce((total, question) => total + question.points, 0);

              contentHTML='<h1 class="page-title">第四章 JavaScript的基本语法</h1>'+
                                '<p class="start-content">在这章中，我将介绍5个概念：</p>'+
                                '<ul class="start-content care">'+
                                '<li>空白</li>'+
                                '<li>区分大小写</li>'+
                                '<li>值</li>'+
                                '<li>标识符</li>'+
                                '<li>注释</li>'+
                                '</ul>';
                                contentHTML += `
                                <div style="position: sticky; top: 0; background-color: #f8f9fa; padding: 10px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); z-index: 100;">
                                  <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <h3 style="margin: 0;">当前得分: <span id="current-score">0</span>/${totalQuestions}</h3>
                                    <div>
                                      <span id="progress-text">已回答: 0/${questions.length}</span>
                                      <div style="width: 200px; height: 10px; background-color: #e9ecef; border-radius: 5px; margin-top: 5px;">
                                        <div id="progress-bar" style="width: 0%; height: 100%; background-color: #4CAF50; border-radius: 5px; transition: width 0.3s;"></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              `;
                contentHTML+='<p class="page-title-2">4.1  空白</p>'+
                                    '<p class="start-content">JavaScript通常忽略标记之间多余的空格和换行，但它们并非在任何位置都能随意添加；字符串、正则表达式、自动分号插入和词法边界都可能受影响。</p>'+
                                    '<p class="start-content">在实践中，您很可能会保持一个定义良好的风格，并坚持人们通常使用的风格，并使用链接器或样式工具来强制执行这一点。例如，您可以使用Prettier，它是一个流行的代码格式化工具，它可以自动格式化您的代码以符合您的风格。</p>'+
                                    '<p class="start-content">例如，使用两个字符来缩进</p>'+
                                  '<p class="page-title-2">4.2  区分大小写</p>'+
                                    '<p class="start-content">JavaScript是区分大小写的，这意味着变量名、函数名和对象名是区分大小写的。</p>'+
                                    '<p class="start-content">例如，变量名“myVariable”和“myvariable”是不同的变量。</p>'+
                                    '<p class="start-content">任何标识符都是如此。</p>'+
                                  '<p class="page-title-2">4.3  值</p>'+
                                    '<p class="start-content">值是JavaScript中的基本构建块。我们定义在源代码中编写的<strong>值</strong>，例如，数字、字符串、布尔值或更高级的构造，如对象字或数组字：</p>'+
                                    '<ul class="start-content care">'+
                                      '<li>数字：1、2、3、4、5、6、7、8、9、0</li>'+
                                      '<li>字符串：“hello”、“world”、“123”</li>'+
                                      '<li>布尔值：true、false</li>'+
                                        '<li>对象字：{ name: "John", age: 30 }</li>'+
                                        '<li>数组字：[1, 2, 3, 4, 5]</li>'+
                                    '</ul>'+
                                    '<p class="start-content">这些都是JavaScript中的值。</p>'+
                                  '<p class="page-title-2">4.4  标识符</p>'+
                                    '<p class="start-content">标识符是JavaScript中的基本构建块。我们定义在源代码中编写的<strong>标识符</strong>，例如，变量名、函数名和对象名：</p>'+
                                    '<ul class="start-content care">'+
                                      '<li>变量名：myVariable、my_variable、$element</li>'+
                                      '<li>函数名：calculateTotal、render_page、$</li>'+
                                      '<li>对象名：userProfile、app_state、_cache</li>'+
                                    '</ul>'+
                                    '<p class="start-content">这些都是JavaScript中的标识符。</p>'+
                                    '<p class="start-content">标识符可用于命名变量、函数或对象属性。它可以以允许的 Unicode 字母、美元符号 $ 或下划线 _ 开头，后续还可包含数字；普通 emoji 通常不能直接作为标识符。</p>'+
                                    '<p class="start-content red">美元符号通常用于引用DOM元素。有些名称是为JavaScript内部使用而保留的，我们不能将它们用作标识符。</p>'+
                                  '<p class="page-title-2">4.5  注释</p>'+
                                    '<p class="start-content">评论是任何程序中最重要的部分之一。在任何编程语言中。它们很重要，因为它们可以让我们注释代码，并添加重要的信息，否则，阅读代码的其他人（或我们自己）将无法获得这些信息。</p>'+
                                    '<p class="start-content">JavaScript有两种类型的注释：</p>'+
                                    '<ul class="start-content care">'+
                                      '<li>单行注释：// 这是一个单行注释</li>'+
                                      '<li>多行注释：/* 这是一个多行注释 */</li>'+
                                    '</ul>';
                contentHTML+='<h2 class="page-title-2">练习</h2>';
                questions.forEach((question, index) => {
                    contentHTML += `
                      <div class="question-container" style="margin-bottom: 30px; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
                        <p style="font-weight: bold;">问题 ${index + 1}: ${question.text}</p>
                        <form id="${question.id}-form">
                          ${question.options.map(option => `
                            <div style="margin: 10px 0;">
                              <input type="radio" id="${question.id}-${option.value}" name="${question.id}-answer" value="${option.value}">
                              <label for="${question.id}-${option.value}">${option.label}</label>
                            </div>
                          `).join('')}
                          <button type="submit" style="padding: 8px 15px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">提交答案</button>
                        </form>
                      </div>
                    `;
                  });

                  contentHTML += `
                    <div style="margin-top: 30px; text-align: center;">
                        <button id="view-score-btn" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
                            查看总成绩
                        </button>
                    </div>
                    `;
                  contentDiv.innerHTML = contentHTML;

                  // 为每个问题添加事件监听器
    setTimeout(() => {
        // 更新分数显示
        function updateScoreDisplay() {
            document.getElementById('current-score').textContent = userScore;
            document.getElementById('progress-text').textContent = `已回答: ${answeredQuestions.size}/${questions.length}`;
            const progressPercentage = (answeredQuestions.size / questions.length) * 100;
            document.getElementById('progress-bar').style.width = `${progressPercentage}%`;
        }

        questions.forEach(question => {
          const form = document.getElementById(`${question.id}-form`);
          if (form) {
            form.addEventListener('submit', function(e) {
              e.preventDefault();
              const selectedAnswer = document.querySelector(`input[name="${question.id}-answer"]:checked`);

              // 避免重复计分
              if (selectedAnswer && !answeredQuestions.has(question.id)) {
                answeredQuestions.add(question.id);

                if (selectedAnswer.value === question.correctAnswer) {
                  userScore += question.points;
                  showResultWindow(`问题${question.id.substring(1)}: 回答正确！\n得分: +${question.points}`, true);
                } else {
                  showResultWindow(`问题${question.id.substring(1)}: 回答错误，请重试。\n正确答案是: ${question.correctAnswer === 'true' ? '对' : '错'}`, false);
                }

                // 禁用提交按钮，防止重复提交
                form.querySelector('button[type="submit"]').disabled = true;

                // 更新分数显示
                updateScoreDisplay();
              } else if (!selectedAnswer) {
                showResultWindow("请选择一个答案。", false);
              }
            });
          }
        });

        // 查看总分按钮事件
        const viewScoreBtn = document.getElementById('view-score-btn');
        if (viewScoreBtn) {
            viewScoreBtn.addEventListener('click', function() {
                let scoreDetails = `总分: ${userScore}/${totalQuestions}\n\n`;
                scoreDetails += `完成进度: ${answeredQuestions.size}/${questions.length} 题\n\n`;

                questions.forEach((q, index) => {
                    const status = answeredQuestions.has(q.id) ?
                                  (document.querySelector(`input[name="${q.id}-answer"]:checked`).value === q.correctAnswer ?
                                  "✓ 正确" : "✗ 错误") : "未回答";
                    scoreDetails += `问题 ${index + 1}: ${status}\n`;
                });

                showScoreSummary(scoreDetails, userScore, totalQuestions);
            });
        }
    }, 100);
    break;
    case 'page5':
      contentDiv.innerHTML = '<h1 class="page-title">第五章 分号</h1>'+
                              '<p class="start-content">JavaScript程序中的每一行都可以使用分号来终止。</p>'+
                              '<p class="start-content">之所以这么说，是因为JavaScript解释器足够聪明，可以为您引入分号。在大多数情况下，您可以从程序中完全省略分号</p>'+
                              '<p class="start-content">这个事实是非常有争议的，你总是会发现使用分号的代码和没有使用的代码。我个人的偏好是总是避免分号，除非严格必要。</p>'+
                              '<h2 class="page-title-2">本章无练习，请继续学习🔜</h2>';
        break;
    case 'page6':
      contentDiv.innerHTML = '<h1 class="page-title">第六章 值</h1>'+
                              '<p class="start-content">hello字符串是一个值。像12这样的数字是一个值。字符串和数字是这些值的类型。</p>'+
                              '<p class="start-content">类型是值的种类，它的类别。我们在JavaScript中有许多不同的类型，我们稍后将详细讨论它们。每种类型都有它自己的特点。</p>'+
                                '<p class="start-content">当我们需要有一个对一个值的引用时，我们将它赋给一个变量。该变量可以有一个名称，并且该值是存储在一个变量中的内容，因此我们以后可以通过变量名访问该值。</p>'+
                              '<h2 class="page-title-2">本章无练习，请继续学习🔜</h2>';
        break;
    case 'page7':
        userScore = 0;
        totalQuestions = 0;
        answeredQuestions = new Set();

        questions = [
            {
            id: 'q1',
            text: 'const声明的变量可以重新赋值',
            options: [
                { value: 'true', label: '对' },
                { value: 'false', label: '错' }
            ],
            correctAnswer: 'false',
            points: 1
            },
            {
            id: 'q2',
            text: 'let声明的变量可以重新赋值',
            options: [
                { value: 'true', label: '对' },
                { value: 'false', label: '错' }
            ],
            correctAnswer: 'true',
            points: 1
            },
            {
            id: 'q3',
            text: 'const声明的对象，其属性值不能被修改',
            options: [
                { value: 'true', label: '对' },
                { value: 'false', label: '错' }
            ],
            correctAnswer: 'false',
            points: 1
            },
            {
            id: 'q4',
            text: '以下哪种声明是正确的？',
            options: [
                { value: 'a', label: 'const a;' },
                { value: 'b', label: 'let a = 0;' },
                { value: 'c', label: 'let a; a = 0;' },
                { value: 'd', label: 'b和c都正确' }
            ],
            correctAnswer: 'd',
            points: 1
            },
            {
            id: 'q5',
            text: '以下哪个代码会产生错误？',
            options: [
                { value: 'a', label: 'let a = 1; a = 2;' },
                { value: 'b', label: 'const a = 1; a = 2;' },
                { value: 'c', label: 'const obj = {a: 1}; obj.a = 2;' },
                { value: 'd', label: 'let a; const b = a;' }
            ],
            correctAnswer: 'b',
            points: 1
            }
        ];

        totalQuestions = questions.reduce((total, question) => total + question.points, 0);

        contentHTML='<h1 class="page-title">第七章 变量</h1>'+
                              '<p class="start-content">变量是分配给标识符的值，因此您可以在程序中引用并使用它。这是因为JavaScript<strong>类型松散</strong>，这是你经常听到的概念</p>'+
                              '<p class="start-content">必须声明一个变量才能使用它。我们有两种声明变量的主要方法。</p>'+
                              '<ul class="start-content care">'+
                                '<li>第一个是使用const：const a = 0</li>'+
                                '<li>第二种方法是使用let：let a = 0</li>'+
                              '</ul>'+
                                '<p class="start-content">const和let的区别在于，const变量不能被重新分配，而let变量可以被重新分配。</p>'+
                                '<p class="start-content">例如：如果你写出<br>const a = 0<br>a=1</p>'+
                                '<p class="start-content">你会得到一个错误，因为你不能重新分配一个const变量。</p>'+
                                '<p class="start-content">如果你写出<br>let a = 0<br>a=1</p>'+
                                '<p class="start-content">你不会得到错误，因为你可以重新分配一个let变量。</p>'+
                                '<p class="start-content red">const并不意味着像C语言中那样“恒定”。具体来说，它并不表示值不能改变——而是指该值不能被重新赋值。如果变量指向一个对象或数组（我们稍后会详细讨论对象和数组），那么对象或数组的内容可以自由更改。</p>'+
                                '<p class="start-content">Const变量必须在声明时进行初始化。例如const a = 0</p>'+
                                '<p class="start-content">但let值可以在以后初始化：例如<br>let a<br>a=0</p>'+
                                '<p class="start-content">您可以在同一条语句中同时声明多个变量：</p>'+
                                '<p class="start-content">const a = 0, b = 1, c = 2,let d = 2,e = 3</p>'+
                                '<p class="start-content">但是你不能多次重新声明同一个变量：例如let a=1,let a=2，否则你就会得到一个“重复的声明”错误。</p>'+
                                '<p class="start-content">我的建议是始终使用const，并且只在您知道您需要将一个值重新分配给该变量时使用let。为什么因为我们的代码所拥有的能力越少，就越好。如果我们知道一个值不能被重新分配，那么它就会减少一个bug的来源</p>'+
                                '<p class="start-content">既然我们已经了解了如何使用const和let，稍稍提一下var。</p>'+
                                '<p class="start-content">直到2015年，var是我们在JavaScript中声明变量的唯一方式。如今，现代代码库大多会直接使用const和let。这里有一些基本的区别在本文中详细说明了，但如果你是初学者，可能不会太在意这些差异。直接使用const和let即可。</p>'+
                                '<h2 class="page-title-2">练习</h2>';
                                contentHTML += `
                                    <div style="position: sticky; top: 0; background-color: #f8f9fa; padding: 10px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); z-index: 100;">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <h3 style="margin: 0;">当前得分: <span id="current-score">0</span>/${totalQuestions}</h3>
                                        <div>
                                        <span id="progress-text">已回答: 0/${questions.length}</span>
                                        <div style="width: 200px; height: 10px; background-color: #e9ecef; border-radius: 5px; margin-top: 5px;">
                                            <div id="progress-bar" style="width: 0%; height: 100%; background-color: #4CAF50; border-radius: 5px; transition: width 0.3s;"></div>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                `;
                                contentHTML += '<h2 class="page-title-2">练习</h2>';
                                questions.forEach((question, index) => {
                                    contentHTML += `
                                      <div class="question-container" style="margin-bottom: 30px; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
                                        <p style="font-weight: bold;">问题 ${index + 1}: ${question.text} <span style="color: #666;">(${question.points}分)</span></p>
                                        <form id="${question.id}-form">
                                          ${question.options.map(option => `
                                            <div style="margin: 10px 0;">
                                              <input type="radio" id="${question.id}-${option.value}" name="${question.id}-answer" value="${option.value}">
                                              <label for="${question.id}-${option.value}">${option.label}</label>
                                            </div>
                                          `).join('')}
                                          <button type="submit" style="padding: 8px 15px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">提交答案</button>
                                        </form>
                                      </div>
                                    `;
                                  });

                                  contentHTML += `
                                    <div style="margin-top: 30px; text-align: center;">
                                      <button id="view-score-btn" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
                                        查看总成绩
                                      </button>
                                    </div>
                                  `;

                                  contentDiv.innerHTML = contentHTML;

                                  // 为每个问题添加事件监听器
                                  setTimeout(() => {
                                    // 更新分数显示
                                    function updateScoreDisplay() {
                                      document.getElementById('current-score').textContent = userScore;
                                      document.getElementById('progress-text').textContent = `已回答: ${answeredQuestions.size}/${questions.length}`;
                                      const progressPercentage = (answeredQuestions.size / questions.length) * 100;
                                      document.getElementById('progress-bar').style.width = `${progressPercentage}%`;
                                    }

                                    questions.forEach(question => {
                                      const form = document.getElementById(`${question.id}-form`);
                                      if (form) {
                                        form.addEventListener('submit', function(e) {
                                          e.preventDefault();
                                          const selectedAnswer = document.querySelector(`input[name="${question.id}-answer"]:checked`);

                                          // 避免重复计分
                                          if (selectedAnswer && !answeredQuestions.has(question.id)) {
                                            answeredQuestions.add(question.id);

                                            if (selectedAnswer.value === question.correctAnswer) {
                                              userScore += question.points;
                                              showResultWindow(`问题${question.id.substring(1)}: 回答正确！\n得分: +${question.points}`, true);
                                            } else {
                                              showResultWindow(`问题${question.id.substring(1)}: 回答错误。\n正确答案是: ${getCorrectAnswerLabel(question)}`, false);
                                            }

                                            // 禁用提交按钮，防止重复提交
                                            form.querySelector('button[type="submit"]').disabled = true;

                                            // 更新分数显示
                                            updateScoreDisplay();
                                          } else if (!selectedAnswer) {
                                            showResultWindow("请选择一个答案。", false);
                                          }
                                        });
                                      }
                                    });

                                    // 查看总分按钮事件
                                    const viewScoreBtn = document.getElementById('view-score-btn');
                                    if (viewScoreBtn) {
                                      viewScoreBtn.addEventListener('click', function() {
                                        let scoreDetails = `总分: ${userScore}/${totalQuestions}\n\n`;
                                        scoreDetails += `完成进度: ${answeredQuestions.size}/${questions.length} 题\n\n`;

                                        questions.forEach((q, index) => {
                                          const status = answeredQuestions.has(q.id) ?
                                            (document.querySelector(`input[name="${q.id}-answer"]:checked`).value === q.correctAnswer ?
                                            "✓ 正确" : "✗ 错误") : "未回答";
                                          scoreDetails += `问题 ${index + 1}: ${status}\n`;
                                        });

                                        showScoreSummary(scoreDetails, userScore, totalQuestions);
                                      });
                                    }

                                    // 获取正确答案的显示文本
                                    function getCorrectAnswerLabel(question) {
                                      const correctOption = question.options.find(option => option.value === question.correctAnswer);
                                      return correctOption ? correctOption.label : question.correctAnswer;
                                    }
                                  }, 100);
                                  break;
        case 'page8':
            contentDiv.innerHTML = '<h1 class="page-title">第八章 类型</h1>'+
                              '<p class="start-content">JavaScript中的变量没有附加的任何类型。它们是<strong>无类型的</strong>。一旦将某种类型的值分配给变量，就可以稍后重新分配该变量以承载任何其他类型的值，而没有任何问题。</p>'+
                              '<p class="start-content">在JavaScript中，我们有两种主要的类型：<strong>原始类型</strong>和<strong>对象类型</stronng>。</p>'+
                              '<p class'
    }
  });
});


// 更新预览的函数
function updatePreview() {
    const htmlCode = document.getElementById('html-code').value;
    // 检查css-code元素是否存在
    const cssCodeElement = document.getElementById('css-code');
    const cssCode = cssCodeElement ? cssCodeElement.value : '';

    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';

    const previewDiv = document.getElementById('preview');
    if (previewDiv) {
      previewDiv.innerHTML = '';
      previewDiv.appendChild(iframe);

      const iframeDoc = iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(htmlCode); // 直接使用完整HTML代码
      iframeDoc.close();
    }
}

// 添加显示总分窗口函数
function showScoreSummary(details, score, total) {
    const resultWindow = document.createElement('div');
    resultWindow.className = 'score-summary-window';
    resultWindow.style.position = 'fixed';
    resultWindow.style.top = '50%';
    resultWindow.style.left = '50%';
    resultWindow.style.transform = 'translate(-50%, -50%)';
    resultWindow.style.padding = '25px';
    resultWindow.style.borderRadius = '10px';
    resultWindow.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    resultWindow.style.zIndex = '1000';
    resultWindow.style.minWidth = '400px';
    resultWindow.style.textAlign = 'left';
    resultWindow.style.backgroundColor = '#f8f9fa';
    resultWindow.style.borderColor = '#d6e9c6';
    resultWindow.style.color = '#333';

    // 添加标题
    const titleElement = document.createElement('h2');
    titleElement.style.textAlign = 'center';
    titleElement.style.marginBottom = '20px';
    titleElement.style.color = score >= total * 0.6 ? '#3c763d' : '#a94442';
    titleElement.textContent = `测试结果: ${score}/${total}`;
    resultWindow.appendChild(titleElement);

    // 添加详情
    const detailsElement = document.createElement('pre');
    detailsElement.style.whiteSpace = 'pre-wrap';
    detailsElement.style.margin = '0 0 20px 0';
    detailsElement.style.padding = '10px';
    detailsElement.style.backgroundColor = '#fff';
    detailsElement.style.border = '1px solid #ddd';
    detailsElement.style.borderRadius = '5px';
    detailsElement.textContent = details;
    resultWindow.appendChild(detailsElement);

    // 添加关闭按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '关闭';
    closeButton.style.padding = '8px 16px';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.backgroundColor = '#337ab7';
    closeButton.style.color = 'white';
    closeButton.style.cursor = 'pointer';
    closeButton.style.display = 'block';
    closeButton.style.margin = '0 auto';
    closeButton.onclick = function() {
      document.body.removeChild(resultWindow);
    };
    resultWindow.appendChild(closeButton);

    // 添加到页面
    document.body.appendChild(resultWindow);
}


  // 显示结果窗口函数
  function showResultWindow(message, isCorrect) {
    // 创建窗口元素
    const resultWindow = document.createElement('div');
    resultWindow.className = 'result-window';
    resultWindow.style.position = 'fixed';
    resultWindow.style.top = '50%';
    resultWindow.style.left = '50%';
    resultWindow.style.transform = 'translate(-50%, -50%)';
    resultWindow.style.padding = '20px';
    resultWindow.style.borderRadius = '8px';
    resultWindow.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    resultWindow.style.zIndex = '1000';
    resultWindow.style.minWidth = '300px';
    resultWindow.style.textAlign = 'center';

    // 根据答案正误设置颜色
    if (isCorrect) {
      resultWindow.style.backgroundColor = '#dff0d8';
      resultWindow.style.borderColor = '#d6e9c6';
      resultWindow.style.color = '#3c763d';
    } else {
      resultWindow.style.backgroundColor = '#f2dede';
      resultWindow.style.borderColor = '#ebccd1';
      resultWindow.style.color = '#a94442';
    }

    // 添加消息
    const messageElement = document.createElement('p');
    messageElement.style.fontSize = '18px';
    messageElement.style.margin = '0 0 15px 0';
    messageElement.textContent = message;
    resultWindow.appendChild(messageElement);

    // 添加关闭按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '关闭';
    closeButton.style.padding = '8px 16px';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.backgroundColor = '#337ab7';
    closeButton.style.color = 'white';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = function() {
      document.body.removeChild(resultWindow);
    };
    resultWindow.appendChild(closeButton);
    // 添加到页面
    document.body.appendChild(resultWindow);

    // 点击窗口外部也可以关闭
    document.addEventListener('click', function closeOnClickOutside(event) {
      if (!resultWindow.contains(event.target) && event.target !== resultWindow) {
        document.body.removeChild(resultWindow);
        document.removeEventListener('click', closeOnClickOutside);
      }
    });
  }
