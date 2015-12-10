/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2015 Samlv9 and other contributors.
/// @MIT-LICENSE | dev-1.0.0 | http://samlv9.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
///                                              }|
///                                              }|
///                                              }|     　 へ　　　 ／|    
///      _______     _______         ______      }|      /　│　　 ／ ／
///     /  ___  |   |_   __ \      .' ____ '.    }|     │　Z ＿,＜　／　　 /`ヽ
///    |  (__ \_|     | |__) |     | (____) |    }|     │　　　　　ヽ　　 /　　〉
///     '.___`-.      |  __ /      '_.____. |    }|      Y　　　　　`　 /　　/
///    |`\____) |    _| |  \ \_    | \____| |    }|    ｲ●　､　●　　⊂⊃〈　　/
///    |_______.'   |____| |___|    \______,'    }|    ()　 v　　　　|　＼〈
///    |=========================================\|    　>ｰ ､_　 ィ　 │ ／／
///    | LESS IS MORE!                           ||     / へ　　 /　ﾉ＜|＼＼
///    `=========================================/|    ヽ_ﾉ　　(_／　 │／／
///                                              }|     7　　　　　　  |／
///                                              }|     ＞―r￣￣`ｰ―＿`
///                                              }|
///                                              }|
/// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
/// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
/// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
/// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
/// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
/// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
/// THE SOFTWARE.


function derive( base, ctor ) {
    /// <summary>
    /// 使用 JS 中的原型链，创建类型之间的扩展与继承。</summary>
    /// <param name='base' type='Function'>
    /// 必须，指定被扩展基类。注：该参数可以为 null。</param>
    /// <param name='ctor' type='Function'>
    /// 必须，指定从基类继承的子类。</param>
    /// <returns type='Function'>
    /// 返回对子类的引用。</returns>

    if ( typeof base != "function" ) {
        /// 如果提供的基类不是一个可扩展的对象，则函数不做任何修改。默认 ctor 为 Object 的子类。
        return;
    }

    var newProps = Object.create(base.prototype);
    var oldProps = ctor.prototype;

    /// 覆盖子类的原型对象之前（Prototype），需要保存子类的原型对象（Prototype）。
    /// 然后在覆盖之后，将保存的原型对象上的属性和方法添加到新的原型对象中。
    /// 这样不会导致方法或者属性再应用原型继承后丢失。
    var itList = Object.getOwnPropertyNames(oldProps);
    var itResult = {};

    for ( var i = 0; i < itList.length; ++i ) {
        itResult[itList[i]] = Object.getOwnPropertyDescriptor(oldProps, itList[i]);
    }

    ctor.prototype = newProps;
    Object.defineProperties(ctor.prototype, itResult);

    return ctor;
}