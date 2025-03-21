// Use these tooltips if you need multiline tooltips. Simply put <br> in the
// tooltip text to start a new line.
// eg :
// <span class="show-tooltip-text" title="Hi there!<br>How are you?">
//   Some text or element with a tooltip
// </span>

ShowTooltip = function(e)
{
    var ShowToolTip;
    var text = $(this).next('.show-tooltip-text');
    if (text.attr('class') != 'show-tooltip-text')
        return false;

    try { if (text[0].innerText == "") { return false; } } catch (e) {}
    
    text.fadeIn()
		.css('top', e.pageY)
		.css('left', e.pageX + 10);

    return false;
}

HideTooltip = function(e)
{
    var text = $(this).next('.show-tooltip-text');
    if (text.attr('class') != 'show-tooltip-text')
        return false;

    text.fadeOut();
}

SetupTooltips = function()
{
    $('.show-tooltip')
		.each(function()
		{
		    $(this)
				.after($('<span/>')
					.attr('class', 'show-tooltip-text')
					.html($(this).attr('title')))
				.attr('title', '');
		})
		.hover(ShowTooltip, HideTooltip);
}

//$(document).ready(function()
//{
//    SetupTooltips();
//});