// Adobe Illustrator 脚本：调整下划线距离
// 作者：设计师
// 功能：允许用户以毫米为单位调整选中文本区域的下划线距离

#target illustrator

function adjustUnderlineDistance() {
    var doc = app.activeDocument;
    var selection = doc.selection;
    
    // 检查是否有选中的对象
    if (!selection || selection.length === 0) {
        alert("请先选择文本区域");
        return;
    }
    
    // 尝试直接获取选中文本
    var textRange = null;
    var textFrame = null;
    
    // 方法：遍历选中对象，寻找文本相关对象
    for (var i = 0; i < selection.length; i++) {
        if (selection[i]) {
            if (selection[i].typename === "TextRange") {
                textRange = selection[i];
                textFrame = textRange.parent;
                break;
            } else if (selection[i].typename === "TextFrame") {
                textFrame = selection[i];
                // 检查是否有文本被选中
                if (selection[i].textRange.startIndex !== selection[i].textRange.endIndex) {
                    textRange = selection[i].textRange;
                } else {
                    // 整个文本框被选中，使用整个文本范围
                    textRange = selection[i].textRange;
                }
                break;
            } else if (selection[i].typename === "Character" || 
                       selection[i].typename === "Word" || 
                       selection[i].typename === "Line" || 
                       selection[i].typename === "Paragraph") {
                // 处理文本子对象的情况
                textRange = selection[i];
                textFrame = selection[i].parent;
                // 向上查找直到找到TextFrame
                while (textFrame && textFrame.typename !== "TextFrame") {
                    textFrame = textFrame.parent;
                }
                break;
            }
        }
    }
    
    // 如果找到了文本范围
    if (textRange) {
        // 获取用户输入的下划线距离（毫米）
        var distanceMM = prompt("请输入下划线距离（毫米）：", "1");
        if (distanceMM === null) return; // 用户取消
        
        distanceMM = parseFloat(distanceMM);
        if (isNaN(distanceMM)) {
            alert("请输入有效的数字");
            return;
        }
        
        // 将毫米转换为点（1毫米 = 2.83465点）
        var distancePoints = distanceMM * 2.83465;
        
        // 直接修改选中文本的下划线属性
        try {
            // 隐藏原始文本的下划线
            textRange.characterAttributes.underline = false;
            
            // 复制选中文本的内容
            var selectedText = textRange.contents;
            
            // 创建新的文本框，用于显示下划线
            var underlineTextFrame = doc.textFrames.add();
            underlineTextFrame.contents = selectedText;
            
            // 尝试获取选中文本的精确位置
            var textBounds = null;
            try {
                textBounds = textRange.bounds;
                if (textBounds && textBounds.length === 4) {
                    underlineTextFrame.top = textBounds[1];
                    underlineTextFrame.left = textBounds[0];
                    underlineTextFrame.width = textBounds[2] - textBounds[0];
                    underlineTextFrame.height = textBounds[1] - textBounds[3];
                }
            } catch (e) {
                // 忽略错误
            }
            
            // 复制文本属性（确保与原始文本完全一致）
            var underlineAttributes = underlineTextFrame.textRange.characterAttributes;
            var originalAttributes = textRange.characterAttributes;
            
            // 复制所有相关属性
            try {
                underlineAttributes.textFont = originalAttributes.textFont;
                underlineAttributes.size = originalAttributes.size;
                underlineAttributes.fillColor = originalAttributes.fillColor;
                // 确保没有描边
                underlineAttributes.strokeWeight = 0;
                underlineAttributes.leading = originalAttributes.leading;
                underlineAttributes.tracking = originalAttributes.tracking;
                underlineAttributes.kerning = originalAttributes.kerning;
                underlineAttributes.baselineShift = originalAttributes.baselineShift;
            } catch (e) {
                // 忽略属性复制错误
            }
            
            // 添加下划线
            underlineAttributes.underline = true;
            
            // 调整基线偏移，使下划线向下移动指定距离
            underlineAttributes.baselineShift = (originalAttributes.baselineShift || 0) - distancePoints;
            
            // 确保新创建的文本框可见
            underlineTextFrame.visible = true;
            
            // 选中新创建的文本框
            doc.selection = [underlineTextFrame];
            
            alert("下划线距离已调整为 " + distanceMM + " 毫米");
        } catch (e) {
            alert("调整下划线距离失败：" + e.message);
        }
    } else {
        // 输出所有选中对象的类型，用于调试
        var selectionTypes = "";
        for (var i = 0; i < selection.length; i++) {
            if (selection[i]) {
                selectionTypes += "对象 " + i + ": " + selection[i].typename + "\n";
            }
        }
        alert("未找到文本区域。\n选中的对象类型：\n" + selectionTypes);
    }
}

// 运行脚本
adjustUnderlineDistance();